import random
from datetime import timedelta

def random_time_points(start_time, end_time, num_points):
    delta = end_time - start_time
    delta_seconds = int(delta.total_seconds())
    random_seconds = sorted(random.randint(0, delta_seconds // 60 - 1) * 60 for _ in range(num_points))
    time_points = [start_time + timedelta(seconds=sec) for sec in random_seconds]
    return time_points