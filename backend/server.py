from fastapi import FastAPI

from pydantic import BaseModel
from typing import List, Dict, Tuple, Optional

from model import *

app = FastAPI()

class UserData(BaseModel):
    username: str
    email: str

@app.post("/create_user/")
def api_create_user(user: UserData):
    user_id = create_user(user.username, user.email)
    return {"user_id": user_id}

class FriendData(BaseModel):
    userA: str
    userB: str

@app.post("/make_friend/")
def api_make_friend(friend: FriendData):
    set_id = make_friend(friend.userA, friend.userB)
    return {"set_id": set_id}

class GroupData(BaseModel):
    groupname: str
    user_list: List[str]

@app.post("/create_group/")
def api_create_group(group: GroupData):
    set_id = create_group(group.groupname, group.user_list)
    return {"set_id": set_id}

class TransactionData(BaseModel):
    name: str
    set_id: str
    label: int
    date: str
    user_list: List[str]
    split_type: str
    payers: Optional[List[Tuple[str, float]]] = list()
    owners: Optional[List[Tuple[str, str, float]]] = list()
    balance: Optional[Dict[str, float]] = dict()

@app.post("/create_transaction/")
def api_create_transaction(transaction: TransactionData):
    transaction_id = create_transaction(Transaction(
        transaction.name,
        transaction.set_id,
        transaction.label,
        transaction.date,
        transaction.user_list,
        transaction.split_type,
        payers=transaction.payers,
        owners=transaction.owners,
        balance=transaction.balance))
    return {"transaction_id": transaction_id}

class UserGroup(BaseModel):
    user_id: str
    set_id: str

@app.post("/add_user/")
def api_add_user(usergroup: UserGroup):
    res = add_user(usergroup.user_id, usergroup.set_id)
    return {"res": res}

@app.get("/get_user/")
def api_get_user(email: str):
    user_data = get_email_user(email)
    user = {
        "id": user_data["_id"],
        "name": user_data["name"],
        "image": None
    }
    return user

@app.get("/get_friends/")
def api_get_friends(user_id: str):
    friend_list = get_user(user_id)["friend_list"]
    friends = list()
    for set_id in friend_list:
        set = get_transaction_set(set_id)
        friend_id = set["user_list"][0] if set["user_list"][0] != user_id else set["user_list"][1]
        friends.append({
            "id": set_id,
            "name": get_user(friend_id)["name"],
            "balance": set["balance"][user_id],
            "image": None
        })
    return friends

@app.get("/get_groups/")
def api_get_groups(user_id: str):
    group_list = get_user(user_id)["group_list"]
    groups = list()
    for set_id in group_list:
        set = get_transaction_set(set_id)
        groups.append({
            "id": set_id,
            "name": set["name"],
            "balance": set["balance"][user_id],
            "image": None
        })
    return groups

@app.get("/get_friend/")
def api_get_friend(user_id: str, set_id: str):
    set = get_transaction_set(set_id)
    friend_id = set["user_list"][0] if set["user_list"][0] != user_id else set["user_list"][1]
    friend = {
        "name": get_user(friend_id)["name"],
        "balance": set["balance"][user_id],
        "image": None,
        "transactions": list()
    }
    for transaction_id in set["transaction_list"]:
        transaction = get_transaction(transaction_id)
        total_amount = sum([amount for _, amount in transaction["payers"]])
        friend["transactions"].append({
            "name": transaction["name"],
            "label": transaction["label"],
            "date": transaction["date"],
            "payer": {
                "name": get_user(transaction["payers"][0][0])["name"],
                "amount": total_amount
            },
            "balance": transaction["balance"][user_id] if user_id in transaction["balance"] else 0
        })
    friend["transactions"].sort(key=lambda transaction: transaction["date"])
    return friend

@app.get("/get_group/")
def api_get_group(user_id: str, set_id: str):
    set = get_transaction_set(set_id)
    group = {
        "name": set["name"],
        "balance": set["balance"][user_id],
        "image": None,
        "transactions": list()
    }
    for transaction_id in set["transaction_list"]:
        transaction = get_transaction(transaction_id)
        total_amount = sum([amount for _, amount in transaction["payer"]])
        group["transactions"].append({
            "name": transaction["name"],
            "label": transaction["label"],
            "date": transaction["date"],
            "payer": {
                "name": get_user(transaction["payer"][0][0])["name"] if len(transaction["payer"]) == 1 else len(transaction["payer"]),
                "amount": total_amount
            },
            "balance": transaction["balance"][user_id] if user_id in transaction["balance"] else 0
        })
    group["transactions"].sort(key=lambda transaction: transaction["date"])
    return group

@app.get("/get_transaction/")
def api_get_transaction(id: str):
    transaction_data = get_transaction(id)
    transaction = {
        "name": transaction_data["name"],
        "set_id": transaction_data["set_id"],
        "label": transaction_data["label"],
        "date": transaction_data["date"],
        "user_list": transaction_data["user_list"],
        "split_type": transaction_data["split_type"],
    }
    if transaction["split_type"] == "balance":
        transaction["balance"] = [{
            "name": get_user(user_id),
            "user_id": user_id,
            "amount": transaction_data["balance"][user_id]
        } for user_id in transaction_data["balance"].keys()]
    elif transaction["split_type"] == "payment":
        transaction["payers"] = [{
            "name": get_user(user_id),
            "user_id": user_id,
            "amount": amount
        } for user_id, amount in transaction_data["payers"]]
        transaction["owners"] = [{
            "name": get_user(user_id),
            "user_id": user_id,
            "type": own_type,
            "value": value
        } for user_id, own_type, value in transaction_data["owners"]]
    return transaction

@app.post("/del_user/")
def api_del_user(user_id: str):
    result = del_user(user_id)
    return {"result": result}

@app.post("/del_transaction_set/")
def api_del_set(set_id: str):
    result = del_transaction_set(set_id)
    return {"result": result}

@app.post("/del_transaction/")
def api_del_transaction(transaction_id: str):
    result = del_transaction(transaction_id)
    return {"result": result}