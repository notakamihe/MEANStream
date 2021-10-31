import {Pipe, PipeTransform} from '@angular/core';

@Pipe ({  
  name : 'collectionCase'  
})  
class CollectionCasePipe implements PipeTransform {  
  transform(val : string) : string {  
    switch (val.toLowerCase()) {
      case "lp":
      case "ep":
        return val.toUpperCase()
      default:
        return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase()
    }
  }  
}  

export default CollectionCasePipe