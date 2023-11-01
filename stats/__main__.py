import json
from data.Data import Data


def main():
    with open('assets/results.json') as f:
        j = json.loads(f.read())
        data = Data(j)
        print(data.c_010.https.Python_Async_uvloop)

if __name__ == '__main__':
    main()