import random
from numpy import sin, cos, arccos, pi, round

def random_time_points(start_time, end_time, num_points):
    start_time = int(start_time)
    end_time = int(end_time)
    delta = end_time - start_time
    random_seconds = sorted(random.randint(0, delta // 60 - 1) * 60 for _ in range(num_points))
    time_points = [start_time + sec for sec in random_seconds]
    t = []
    for i in range(0, 5):
        if i == 0 or time_points[i] != time_points[i-1]:
            t.append(time_points[i])
    return t

# calculate gps distance
def rad2deg(radians):
    degrees = radians * 180 / pi
    return degrees

def deg2rad(degrees):
    radians = degrees * pi / 180
    return radians

def cal_dis_gps(gps_data1, gps_data2):

    latitude1 = gps_data1["latitude"]
    longitude1 = gps_data1["longitude"]
    latitude2 = gps_data2["latitude"]
    longitude2 = gps_data2["longitude"]
    
    theta = longitude1 - longitude2
    
    distance = 60 * 1.1515 * rad2deg(
        arccos(
            (sin(deg2rad(latitude1)) * sin(deg2rad(latitude2))) + 
            (cos(deg2rad(latitude1)) * cos(deg2rad(latitude2)) * cos(deg2rad(theta)))
        )
    )
    
    return distance * 1.609344 * 1000

# end calculate gps distance
