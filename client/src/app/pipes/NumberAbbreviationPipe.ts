import {Pipe, PipeTransform} from '@angular/core';
import numeral from 'numeral';

@Pipe ({  
  name : 'abbreviatedNumber'  
})  
class NumberAbbreviationPipe implements PipeTransform {  
  transform(val : number) : string {  
    return numeral(val).format("0a");  
  }  
}  

export default NumberAbbreviationPipe