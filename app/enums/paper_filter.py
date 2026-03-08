from enum import Enum

class SortBy(str, Enum) :
    RELEVANCE  = "relevance" 
    YEAR_DESC  = "year_desc" 
    YEAR_ASC   = "year_asc"  
    CITATIONS  = "citations" 