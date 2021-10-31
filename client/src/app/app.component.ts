import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import environment from '../environments/environment';
import { CurrentUserService } from './services/current-user/current-user.service';
import numeral from "numeral"
import moment from 'moment';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    public currentUserService : CurrentUserService,
    private themeService : ThemeService
  ) {
    this.translate.setDefaultLang('en');
    
  }

  ngOnInit() : void {
    this.setLocales()
  }

  setLocales() : void {
    moment.updateLocale("en", {
      relativeTime: {
        future: '%s',
        past: '%s',
        s: '%ds',
        ss: '%ds',
        m: '%dm',
        mm: '%dm',
        w: "%dw",
        ww: "%dw",
        h: '%dh',
        hh: '%dh',
        d: '%dd',
        dd: '%dd',
        M:  "%dm",
        MM: "%dm",
        y: "%dy",
        yy: "%dy"
      }
    })

    numeral.register("locale", "us", {
      delimiters: {
        thousands: ",",
        decimal: "."
      },
      abbreviations: {
        thousand: "K",
        million: "M",
        billion: "B",
        trillion: "T"
      },
      currency: {
        symbol: "$"
      },
      ordinal: function (number) {
        var b = number % 10;
        return (~~ (number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
      }
    })

    numeral.locale("us")
  }
}
