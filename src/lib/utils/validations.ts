type validateFunc = (value: string) => boolean;

/* tsのインデックスシグネチャを定義する */
interface Validator {
  [key: string]: validateFunc;
}

export const validators: Validator = {
  required: (value: string) => {
    return !!value.length;
  },
  email: (value: string) => {
    // empty field should pass
    if (!value || !value.length) {
      return true;
    }
    // Check if email
    if (!/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/.test(value)) {
      return false;
    }
    return true;
  },
  yesno: (value: string) => {
    return value === "はい" || value === "いいえ";
  },
};
