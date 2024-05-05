

export function convertToJalali(time) {
  var newTime = new Date(time * 1000)
  var t = gregorian_to_jalali(newTime.getFullYear(), newTime.getMonth() + 1, newTime.getDate());
  return pr_num(t[0] + '/' + t[1] + '/' + t[2]);
}

String.prototype.toPersinaDigit = function () {
  var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return this.replace(/[0-9]/g, function (w) {
    return id[+w]
  });
}

export function tooman3(price, discount = 0, count = 1) {
  price = Number(price);
  discount = Number(discount);
  if (count) price = count * (price - (price * discount / 100));
  price = price / 10
  price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  price = price.toString().toPersinaDigit();
  return price;
}

export function tooman(price, discount = 0, divide_per_ten = true, show_tooman_text = true) {
  var price_no_discount = Number(price);
  price = Number(price);
  discount = Number(discount);
  price = price - (price * discount / 100);
  if (divide_per_ten) price = price / 10;

  price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  price = price.toString().toPersinaDigit();

  if (show_tooman_text) price = price + '<span class="price-tooman"> تومان</span>';
  if (discount > 0) {
    price_no_discount = price_no_discount / 10;
    price_no_discount = price_no_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    price_no_discount = price_no_discount.toString().toPersinaDigit();
    price = price + ' <span class="c-price-before-discount">' + price_no_discount + '<span>';
    // price = price + '<span class="c-price-price-before-discount-tooman"> تومان</span>';
  }
  return price;
}

export function numPr(number) {
  number = Number(number);
  number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  number = number.toString().toPersinaDigit();
  return number;
}

export function gregorian_to_jalali(gy, gm, gd) {
  var g_d_m, jy, jm, jd, gy2, days;
  g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  gy2 = (gm > 2) ? (gy + 1) : gy;
  days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  jy = -1595 + (33 * ~~(days / 12053));
  days %= 12053;
  jy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  if (days < 186) {
    jm = 1 + ~~(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + ~~((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

export function jalali_to_gregorian(jy, jm, jd) {
  var sal_a, gy, gm, gd, days;
  jy += 1595;
  days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  gy = 400 * ~~(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * ~~(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  gd = days + 1;
  sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  return [gy, gm, gd];
}

export function convertDate(time) {
  var newTime = new Date(time * 1000);
  var t = gregorian_to_jalali(newTime.getFullYear(), newTime.getMonth() + 1, newTime.getDate());
  return pr_num(t[0] + '/' + t[1] + '/' + t[2]);
}

// export function snakbar(msg, status) {
//   // var snack = document.getElementsByClassName("snackbar");
//   if (status === 'success') var x = document.getElementById("snackbar-success");
//   if (status === 'warning') var x = document.getElementById("snackbar-warning");
//   if (status === 'error') var x = document.getElementById("snackbar-error");

//   x.className = "show";
//   x.innerText = msg;
//   setTimeout(function () {
//     x.className = x.className.replace("show", "");
//   }, 3000);
// }

// export function product_snakbar(comapre_length) {
//   var out = true;
//   if (screen.width < 1000 && comapre_length > 2) {
//     const msg = "کالای دیگری به مقایسه نمیتوانید اضافه کنید";
//     snakbar(msg, 'warning');
//     out = false;
//   }
//   if (screen.width > 1000 && comapre_length > 4) {
//     const msg = "کالای دیگری به مقایسه نمیتوانید اضافه کنید";
//     snakbar(msg, 'warning');
//     out = false;
//   }
//   return out;
// }

export function pr_num(num) {
  if (num) return num.toString().toPersinaDigit();
}

// export function sum_arr(array) {
//     return array.reduce(function (a, b) {
//         return parseFloat(a) + parseFloat(b);
//     }, 0);
// }

export function pr_date(createdAt, day = 0, hour = true) {
  // createdAt is mongoose timestamp
  var date = null
  if (createdAt != null) {
    date = new Date(createdAt)
  } else {
    date = new Date()
  }
  if (day != 0) date.setDate(date.getDate() + day);

  var obj = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }
  if (!hour) obj = { day: 'numeric', month: 'long', year: 'numeric' }
  var x = date.toLocaleString('fa-IR', obj)
  return x;
}

const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
const e2p = s => s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])


export function timeAgo(timestamp) {
  const currentTime = new Date();
  const timePassed = new Date(currentTime - new Date(timestamp));

  const seconds = Math.floor(timePassed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else {
    return 'Just now';
  }
}

export function timeAgoPr(timestamp) {
  const currentTime = new Date();
  const timePassed = new Date(currentTime - new Date(timestamp));

  const seconds = Math.floor(timePassed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  var out = ''
  if (days > 0) {
    out = days === 1 ? '1 روز قبل' : `${days} روز قبل`;
  } else if (hours > 0) {
    out = hours === 1 ? 'یک ساعت قبل' : `${hours} ساعت قبل`;
  } else if (minutes > 0) {
    out = minutes === 1 ? 'یک دقیقه قبل' : `${minutes} دقیقه قبل`;
  } else {
    out = 'دقایقی پیش';
  }

  return out.toString().toPersinaDigit()
}

const JalaliDate = {
  g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
};

export function jalaliToGregorian(j_y, j_m, j_d) {
  j_y = parseInt(j_y);
  j_m = parseInt(j_m);
  j_d = parseInt(j_d);
  var jy = j_y - 979;
  var jm = j_m - 1;
  var jd = j_d - 1;

  var j_day_no = 365 * jy + parseInt(jy / 33) * 8 + parseInt((jy % 33 + 3) / 4);
  for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];

  j_day_no += jd;

  var g_day_no = j_day_no + 79;

  var gy = 1600 + 400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
  g_day_no = g_day_no % 146097;

  var leap = true;
  if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
    g_day_no--;
    gy += 100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
    g_day_no = g_day_no % 36524;

    if (g_day_no >= 365) g_day_no++;
    else leap = false;
  }

  gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
  g_day_no %= 1461;

  if (g_day_no >= 366) {
    leap = false;

    g_day_no--;
    gy += parseInt(g_day_no / 365);
    g_day_no = g_day_no % 365;
  }

  for (var i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap); i++)
    g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
  var gm = i + 1;
  var gd = g_day_no + 1;

  gm = gm < 10 ? "0" + gm : gm;
  gd = gd < 10 ? "0" + gd : gd;

  return [gy, gm, gd];
}

export function convertDateToGregorian(date) {
  if (!date) return false
  var myDate = date, dateSplitted = myDate.split("/"),
    jD = jalaliToGregorian(dateSplitted[0], dateSplitted[1], dateSplitted[2]);
  return jD[0] + "/" + jD[1] + "/" + jD[2];
}

export function dateFilter(date1) {
  if (date1 && date1 !== '') {
    date1 = convertDateToGregorian(date1);
  } else { date1 = '2022/01/01' }

  // date1 = new Date(date1)  // As text
  return date1
}