import requests
import pandas as pd

BEHAVIOR_URL = \
    "http://localhost:8080/api/behaviors/export"


def load_data():

    data = requests.get(
        BEHAVIOR_URL
    ).json()

    return pd.DataFrame(data)