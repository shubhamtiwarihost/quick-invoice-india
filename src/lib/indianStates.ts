export interface IndianState {
  name: string;
  code: string;
  capital: string;
  type: "State" | "Union Territory" | "Other";
  zone: "Northern" | "Southern" | "Western" | "Eastern" | "Central" | "North-Eastern" | "Special";
}

export const INDIAN_STATES: IndianState[] = [
  { name: "Jammu and Kashmir", code: "01", capital: "Srinagar / Jammu", type: "Union Territory", zone: "Northern" },
  { name: "Himachal Pradesh", code: "02", capital: "Shimla", type: "State", zone: "Northern" },
  { name: "Punjab", code: "03", capital: "Chandigarh", type: "State", zone: "Northern" },
  { name: "Chandigarh", code: "04", capital: "Chandigarh", type: "Union Territory", zone: "Northern" },
  { name: "Uttarakhand", code: "05", capital: "Dehradun", type: "State", zone: "Northern" },
  { name: "Haryana", code: "06", capital: "Chandigarh", type: "State", zone: "Northern" },
  { name: "Delhi", code: "07", capital: "New Delhi", type: "Union Territory", zone: "Northern" },
  { name: "Rajasthan", code: "08", capital: "Jaipur", type: "State", zone: "Northern" },
  { name: "Uttar Pradesh", code: "09", capital: "Lucknow", type: "State", zone: "Northern" },
  { name: "Bihar", code: "10", capital: "Patna", type: "State", zone: "Eastern" },
  { name: "Sikkim", code: "11", capital: "Gangtok", type: "State", zone: "North-Eastern" },
  { name: "Arunachal Pradesh", code: "12", capital: "Itanagar", type: "State", zone: "North-Eastern" },
  { name: "Nagaland", code: "13", capital: "Kohima", type: "State", zone: "North-Eastern" },
  { name: "Manipur", code: "14", capital: "Imphal", type: "State", zone: "North-Eastern" },
  { name: "Mizoram", code: "15", capital: "Aizawl", type: "State", zone: "North-Eastern" },
  { name: "Tripura", code: "16", capital: "Agartala", type: "State", zone: "North-Eastern" },
  { name: "Meghalaya", code: "17", capital: "Shillong", type: "State", zone: "North-Eastern" },
  { name: "Assam", code: "18", capital: "Dispur", type: "State", zone: "North-Eastern" },
  { name: "West Bengal", code: "19", capital: "Kolkata", type: "State", zone: "Eastern" },
  { name: "Jharkhand", code: "20", capital: "Ranchi", type: "State", zone: "Eastern" },
  { name: "Odisha", code: "21", capital: "Bhubaneswar", type: "State", zone: "Eastern" },
  { name: "Chhattisgarh", code: "22", capital: "Raipur", type: "State", zone: "Central" },
  { name: "Madhya Pradesh", code: "23", capital: "Bhopal", type: "State", zone: "Central" },
  { name: "Gujarat", code: "24", capital: "Gandhinagar", type: "State", zone: "Western" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", code: "26", capital: "Daman", type: "Union Territory", zone: "Western" },
  { name: "Maharashtra", code: "27", capital: "Mumbai", type: "State", zone: "Western" },
  { name: "Karnataka", code: "29", capital: "Bengaluru", type: "State", zone: "Southern" },
  { name: "Goa", code: "30", capital: "Panaji", type: "State", zone: "Western" },
  { name: "Lakshadweep", code: "31", capital: "Kavaratti", type: "Union Territory", zone: "Southern" },
  { name: "Kerala", code: "32", capital: "Thiruvananthapuram", type: "State", zone: "Southern" },
  { name: "Tamil Nadu", code: "33", capital: "Chennai", type: "State", zone: "Southern" },
  { name: "Puducherry", code: "34", capital: "Puducherry", type: "Union Territory", zone: "Southern" },
  { name: "Andaman and Nicobar Islands", code: "35", capital: "Port Blair", type: "Union Territory", zone: "Southern" },
  { name: "Telangana", code: "36", capital: "Hyderabad", type: "State", zone: "Southern" },
  { name: "Andhra Pradesh", code: "37", capital: "Amaravati", type: "State", zone: "Southern" },
  { name: "Ladakh", code: "38", capital: "Leh", type: "Union Territory", zone: "Northern" },
  { name: "Other Territory", code: "97", capital: "New Delhi", type: "Other", zone: "Special" },
];

export function getStateByName(name: string): IndianState | undefined {
  return INDIAN_STATES.find((s) => s.name === name);
}

export function getStateByCode(code: string): IndianState | undefined {
  return INDIAN_STATES.find((s) => s.code === code);
}
