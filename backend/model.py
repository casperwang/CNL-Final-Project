from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.binary import UuidRepresentation

from bson.binary import Binary, UUID_SUBTYPE
import uuid

def get_client():
    uri = "mongodb://localhost:27017"
    return MongoClient(uri, server_api=ServerApi('1'), uuidRepresentation='standard')

def get_db(client=None):
    if client is None:
        client = get_client()
    return client["SplitwiseWeb"]

def create_user(username: str, email: str) -> str:
    """Create user with username and email.

    Returns:
        the id of the user
    """
    db = get_db()
    users_collection = db['users']
    user_id = str(uuid.uuid4())
    users_collection.insert_one({
        "_id": user_id,
        "name": username,
        "email": email,
        "friend_list": list(),
        "group_list": list()
    })
    return user_id

def make_friend(userA: str, userB: str) -> str:
    """Create friend transaction set with information.

    Args:
        name: the name of the transaction set
        user_list: users in the group (by id)

    Returns:
        the id of the friend transaction set
    """
    db = get_db()
    users_collection = db['users']
    transaction_sets_collection = db['transaction_sets']
    set_id = str(uuid.uuid4())
    transaction_sets_collection.insert_one({
        "_id": set_id,
        "type": "friend",
        "user_list": [userA, userB],
        "transaction_list": list(),
        "balance": {userA: 0, userB: 0}
    })
    for user_id in {userA, userB}:
        users_collection.update_one(
            {"_id": user_id},
            {"$push": {"friend_list": set_id}}
        )
    return set_id

def create_group(groupname: str, user_list: list[str]) -> str:
    """Create group transaction set with groupname and user list.

    Args:
        name: the name of the transaction set
        user_list: users in the group (by id)

    Returns:
        the id of the group transaction set
    """
    db = get_db()
    users_collection = db['users']
    transaction_sets_collection = db['transaction_sets']
    set_id = str(uuid.uuid4())
    transaction_sets_collection.insert_one({
        "_id": set_id,
        "name": groupname,
        "type": "group",
        "user_list": user_list,
        "transaction_list": list(),
        "balance": {user: 0 for user in user_list}
    })
    for user_id in user_list:
        users_collection.update_one(
            {"_id": user_id},
            {"$push": {"group_list": set_id}}
        )
    return set_id

def add_user(user_id: str, set_id: str):
    """Add user into a specific group.

    Args:
        user_id: the id of the user
        set_id: the id of the transaction set
    """
    db = get_db()
    users_collection = db['users']
    transaction_sets_collection = db['transaction_sets']
    transaction_sets_collection.update_one(
        {"_id": set_id},
        {"$push": {"user_list": user_id}}
    )
    transaction_sets_collection.update_one(
        {"_id": set_id},
        {"$set": {f"balance.{user_id}": 0}}
    )
    users_collection.update_one(
        {"_id": user_id},
        {"$push": {"group_list": set_id}}
    )
    return user_id in transaction_sets_collection.find_one(
        {"_id": set_id}
    )["user_list"]

def create_transaction(transaction) -> str:
    """Create transaction with the transaction object and update the balance.

    Args:
        transaction: the transaction object
    
    Returns:
        the id of the transaction
    """
    db = get_db()
    transaction_sets_collection = db['transaction_sets']
    transactions_collection = db['transactions']
    transaction_id = str(uuid.uuid4())
    transaction_dict = transaction.__dict__
    transaction_dict["_id"] = transaction_id
    transactions_collection.insert_one(
        transaction_dict
    )
    transaction_sets_collection.update_one(
        {"_id": transaction.set_id},
        {"$push": {"transaction_list": transaction_id}}
    )
    for user_id in transaction.user_list:
        transaction_sets_collection.update_one(
            {"_id": transaction.set_id},
            {"$inc": {f"balance.{user_id}": transaction.balance[user_id]}}
        )
    return transaction_id

def get_email_user(user_email: str):
    db = get_db()
    users_collection = db['users']
    return users_collection.find_one({
        "email": user_email
    })

def get_user(user_id: str):
    db = get_db()
    users_collection = db['users']
    user = users_collection.find_one({"_id": user_id})
    if user is None:
        raise ValueError(f"No user found with ID: {user_id}")
    return user

def get_transaction_set(set_id: str):
    db = get_db()
    transaction_sets_collection = db['transaction_sets']
    transaction_set = transaction_sets_collection.find_one({"_id": set_id})
    if transaction_set is None:
        raise ValueError(f"No transaction set found with ID: {set_id}")
    return transaction_set

def get_transaction(transaction_id: str):
    db = get_db()
    transactions_collection = db['transactions']
    transaction = transactions_collection.find_one({"_id": transaction_id})
    if transaction is None:
        raise ValueError(f"No transaction found with ID: {transaction_id}")
    return transaction

def del_user(user_id: str):
    db = get_db()
    users_collection = db['users']
    users_collection.delete_many({
        "_id": user_id
    })
    return True

def del_transaction_set(set_id: str):
    db = get_db()
    transaction_sets_collection = db['transaction_sets']
    transaction_sets_collection.delete_many({
        "_id": set_id
    })
    return True

def del_transaction(transaction_id: str):
    db = get_db()
    transactions_collection = db['transactions']
    transactions_collection.delete_many({
        "_id": transaction_id
    })
    return True

class Transaction:
    """Store the information of the transaction.

    Attributes:
        name: the name of the transaction
        set_id: the id of the belonged transaction set
        label: the type of the transaction (dining, ticket, etc)
        date: the date of the transaction
        user_list: the list of involved users
        split_type: balance / payment
        payers: the list of (payer, amount)
        owners: the list of (owner, own_type(exact / share), value)
        balance: the final balance for each user in this transaction
    """
    def __init__(self, name, set_id, label, date, user_list, split_type, payers=[], owners=[], balance={}):
        self.name = name
        self.set_id = set_id
        self.label = label
        self.date = date
        self.user_list = user_list
        self.split_type = split_type
        self.balance = balance
        self.payers = payers
        self.owners = owners
        if split_type == "payment":
            self.update_balance()
        elif split_type == "balance":
            self.update_payers()
    
    def update_balance(self):
        for user_id in self.user_list:
            self.balance[user_id] = 0
        total = 0
        for user_id, amount in self.payers:
            self.balance[user_id] += amount
            total += amount
        # exact
        for user_id, type, amount in self.owners:
            if type != "exact":
                continue
            self.balance[user_id] -= amount
            total -= amount
        # share
        total_share = sum([share for _, type, share in self.owners if type == "share"])
        for user_id, type, share in self.owners:
            if type != "share":
                continue
            self.balance[user_id] -= total * share / total_share
    
    def update_payers(self):
        for user_id in self.balance.keys():
            if self.balance[user_id] > 0:
                self.payers.append((user_id, self.balance[user_id]))