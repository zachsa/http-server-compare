class Results:
    def __init__(self, config, results):
        self.c_010 = ProtocolData(results["c=010"])
        self.c_020 = ProtocolData(results["c=020"])
        # self.c_040 = ProtocolData(data["c=040"])


class ProtocolData:
    def __init__(self, data):
        self.http = LanguageData(data.get("http", {}))
        self.https = LanguageData(data.get("https", {}))


class LanguageData:
    def __init__(self, data):
        self.Golang = {"values": None, "stats": None}
        self.Node = {"values": None, "stats": None}
        self.Python_Async = {"values": None, "stats": None}
        self.Python_Async_uvloop = {"values": None, "stats": None}
        self.Ruby_Async = {"values": None, "stats": None} # TODO no https

        for key, value in data.items():
            key_name = self.normalize_key_name(key)
            if hasattr(self, key_name):
                # Check if 'values' and 'stats' are in the value dictionary
                language_data = getattr(self, key_name)
                language_data["values"] = value.get("values")
                # Only set 'stats' if it's present in the input data
                if "stats" in value:
                    language_data["stats"] = value["stats"]
            else:
                raise ValueError(
                    f"Update the LanguageData attributes to include '{key_name}'"
                )

    @staticmethod
    def normalize_key_name(key):
        return key.replace(" ", "_").replace("(", "").replace(")", "")
