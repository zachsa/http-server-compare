import json
import os
from classes import Results
import numpy as np
from scipy import stats


__dirname = os.path.dirname(__file__)
config_path = os.path.join(__dirname, "../", "config.json")
results_path = os.path.join(__dirname, "../assets/results.json")


def main():
    with open(config_path) as c:
        with open(results_path) as r:
            results = json.load(r)
            config = json.load(c)
            data = Results(config, results)

            # f_oneway https c=010
            groups = [
                np.array(data.c_010.https.Node.get("values"), dtype="float"),
                np.array(data.c_010.https.Golang.get("values"), dtype="float"),
                np.array(data.c_010.https.Python_Async.get("values"), dtype="float"),
                np.array(
                    data.c_010.https.Python_Async_uvloop.get("values"), dtype="float"
                ),
            ]
            f_val, p_val = stats.f_oneway(*groups)
            print("c=10", f_val, p_val)

            # f_oneway https c=020
            groups = [
                np.array(data.c_020.https.Node.get("values"), dtype="float"),
                np.array(data.c_020.https.Golang.get("values"), dtype="float"),
                np.array(data.c_020.https.Python_Async.get("values"), dtype="float"),
                np.array(
                    data.c_020.https.Python_Async_uvloop.get("values"), dtype="float"
                ),
            ]

            f_val, p_val = stats.f_oneway(*groups)
            print("c=20", f_val, p_val)


if __name__ == "__main__":
    main()
