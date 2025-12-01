# blacksmith input validator
# v1.0.0 - 10/15/2025
# nevans13

# Validate a given input based on its target type
def vdt(input, inputType):
    try:
        match inputType:
            case "hostname":
                if type(input) != str: raise ValueError("Hostname is invalid type")
                if len(input) < 1: raise ValueError("Hostname is too short")
                if len(input) >= 100: raise ValueError("Hostname is too long")
                return True
            
            # Tags are included as a query parameter string, seperated by an asterisk
            case "tags":
                if type(input) != str: raise ValueError("Tag is invalid type")
                if len(input) < 1: raise ValueError("Tag is too short")
                if len(input) >= 200: raise ValueError("Tag is too long")
                if " " in input: raise ValueError("Tag contains whitespace - space")
                if "\"" in input: raise ValueError("Tag contains invalid character - \"")
                if "'" in input: raise ValueError("Tag contains invalid character - '")
                return True
            
            case _:
                raise ValueError("Unknown input type " + str(inputType))
                
    except:
        raise Exception("Error trying to validate input")