class Data:
    def __init__(self, data):
        self.c_010 = ProtocolData(data["c=010"])
        self.c_020 = ProtocolData(data["c=020"])
        self.c_040 = ProtocolData(data["c=040"])

    def __repr__(self):
        return f"Data(c_010={self.c_010}, c_020={self.c_020}, c_040={self.c_040})"


class ProtocolData:
    def __init__(self, data):
        self.http = LanguageData(data.get("http", {}))
        self.https = LanguageData(data.get("https", {}))

    def __repr__(self):
        return f"ProtocolData(http={self.http}, https={self.https})"


class LanguageData:
    Golang = None
    Node = None
    Python_Async = None
    Python_Async_uvloop = None
    Ruby_Async = None

    def __init__(self, data):
        for key, value in data.items():
            key_name = key.replace(" ", "_").replace("(", "").replace(")", "")
            if hasattr(self, key_name):
                setattr(self, key_name, value)

    def __repr__(self):
        attributes = ", ".join(f"{key}={value}" for key, value in self.__dict__.items())
        return f"LanguageData({attributes})"
