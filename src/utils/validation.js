export const isValidEmail = (email) =>
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

export const isValidPhone = (phone) =>
  /^03[0-9]{9}$/.test(phone);  

export const isValidName = (name) =>
  /^[a-zA-Z\s]{3,}$/.test(name);  

export const isValidCity = (city) =>
  /^[a-zA-Z\s]{2,}$/.test(city);

export const isValidCNIC = (cnic) =>
  /^(\d{5}-\d{7}-\d{1}|\d{13})$/.test(cnic);  