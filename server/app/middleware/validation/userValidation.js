import { check, body, validationResult } from 'express-validator';

// Custom validation function to check if passwords match
const repeatPasswordValidation = (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('رمز عبور و تکرار آن باید یکسان باشند');
  }
  return true;
}

const phoneStartsWithZeroValidation = (value) => {
  if (!value.startsWith('0')) {
    throw new Error('شماره تلفن باید با ۰ شروع شود');
  }
  return true;
};

export const loginCheck = [
  check('phone')
    .escape()
    .notEmpty()
    .withMessage('شماره موبایل را وارد کنید')
    .isLength({ min: 11, max: 11 })
    .withMessage('شماره همراه باید 11 رقم باشد ب صفر اول')
    // .matches(/^\+?[1-9][0-9]{7,14}$/)
    // .withMessage('شماره همراه باید شامل اعداد انگلیسی باشد')
    .custom(phoneStartsWithZeroValidation),
  check('password')
    .escape()
    .notEmpty()
    .withMessage(' رمز عبور را وارد کنید')
    // .matches('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]{8,}$/')
    // .withMessage('رمز عبور باید حداقل 8 کاراکتر و دارای حروف بزرگ و کوچک و کاراکتر خاص باشد')
    .isLength({ min: 5, max: 30 })
    .withMessage('رمز عبور باید حداقل 5 رقم و حداکثر 30 رقم باشد'),
  (req, res, next) => {
    next();
  }
];

export const registerCheck = [
  check('name')
    .escape()
    .notEmpty()
    .withMessage('نام  را وارد کنید')
    .isLength({ min: 5, max: 50 })
    .withMessage('نام باید کمتر از 50 و بیشتر از 5 حرف باشد')
    .matches(/^[' آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی']+$/)
    .withMessage('نام را به فارسی وارد کنید'),
  check('phone')
    .escape()
    .notEmpty()
    .withMessage('شماره موبایل را وارد کنید')
    .isLength({ min: 11, max: 11 })
    .withMessage('شماره همراه باید 11 رقم باشد با صفر اول')
    .custom(phoneStartsWithZeroValidation),
  // .matches(/^\+?[1-9][0-9]{7,14}$/)
  // .withMessage('شماره همراه باید شامل اعداد انگلیسی باشد'),
  check('password')
    .escape()
    .notEmpty()
    .withMessage(' رمز عبور را وارد کنید')
    // .matches('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]{8,}$/')
    // .withMessage('رمز عبور باید حداقل 8 کاراکتر و دارای حروف بزرگ و کوچک و کاراکتر خاص باشد')
    .isLength({ min: 5, max: 30 })
    .withMessage('رمز عبور باید حداقل 5 رقم و حداکثر 30 رقم باشد'),
  check('repeatPassword')
    .escape()
    .custom(repeatPasswordValidation),
  (req, res, next) => {
    next();
  }
]


export const implantFailureFromCheck = [
  check('patientName.fa')
    .notEmpty()
    .withMessage('نام بیمار را وارد کنید')
    .matches(/^[' آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی']+$/)
    .withMessage('نام را به فارسی وارد کنید')
    .escape(),
  check('patient.age')
    .notEmpty()
    .withMessage('سن بیمار را وارد کنید')
    .isNumeric()
    .withMessage('سن بیمار به صورت عدد وارد کنید')
    .escape(),
  check('insertDate')
    .notEmpty()
    .withMessage('تاریخ جایگذاری ایمپلنت را وارد کنید')
    .escape(),
  check('removeDate')
    .notEmpty()
    .withMessage('تاریخ خارج کردن ایمپلنت را وارد کنید')
    .escape(),
  check('implant.bodytype')
    .notEmpty()
    .withMessage('نوع ایمپلنت را انتخاب کنید')
    .escape(),
  check('implant.diameter')
    .notEmpty()
    .withMessage('قطر ایمپلنت را انتخاب کنید')
    .escape(),
  check('implant.size')
    .notEmpty()
    .withMessage('سایز ایمپلنت را انتخاب کنید')
    .escape(),
  check('boneType')
    .notEmpty()
    .withMessage('نوع استخوان را انتخاب کنید')
    .escape(),
  check('implant.code')
    .escape()
    .notEmpty()
    .withMessage('شماره سریال وارد کنید')
    .matches(/^[a-zA-Z0-9]+$/, 'i')
    .withMessage('شماره سریال را به انگلیسی وارد کنید'),
  (req, res, next) => {
    console.log(req.body)
    next();
  }
]
