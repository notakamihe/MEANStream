import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';

@Pipe ({  
  name : 'timeAgo'  
})  
class TimeAgoPipe implements PipeTransform {  
  transform(date : Date) : string {  
    return moment(date).fromNow(); 
  }  
}  

export default TimeAgoPipe