export class Department {
  id: number;
  img: string;
  name: string;
  gender: string;
  bGroup: string;
  date: string;
  address: string;
  mobile: string;
  treatment: string;
  constructor(department) {
    {
      this.id = department.id || this.getRandomID();
      this.img = department.avatar || "assets/images/user/user1.jpg";
      this.name = department.name || "";
      this.gender = department.gender || "male";
      this.bGroup = department.email || "";
      this.date = department.date || "";
      this.address = department.address || "";
      this.mobile = department.mobile || "";
      this.treatment = department.treatment || "";
    }
  }
  public getRandomID(): string {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
