from enum import Enum 

class PaperSource(str, Enum):
    OPENALEX  = "openalex"
    CORE      = "core"
    UPLOADED  = "uploaded"  

class FullTextSource(str, Enum):
    CORE        = "core"      
    UPLOAD      = "upload"   
    INSTITUTION = "institution"  