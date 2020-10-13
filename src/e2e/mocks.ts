export class TestMocks {

  mocks: any = {};

  constructor() {
    this.init();
  }

  init() {
    const date: String = new Date(new Date()).toISOString();
    // the mocks
    this.mocks.user = {
      _id: "5b102ee74569b48d96824ea4",
      kerberosID: "alexanderthegreat",
      name: "Alexander the Great",
      email: "test@gmail.com",
      location: "Babylon",
      title: "Emperor",
      teams: {
        "name": "5b0bddf20f61a10efee24492",
        "access": "1",
        "primary": true
      },
      timestamp: {
        createdAt: date,
        createdBy: {
          kerberosID: "philip",
          name: "Philip II of Macedon",
          email: "test@gmail.com"
        }
      }
    };

    this.mocks.team = {
      name: "Test Team",
      description: "Testing team",
      vision: "Testing vision",
      mission: "Testing mission",
      mailingList: "test@gmail.com",
      manager: {
        kerberosID: "testmgr",
        name: "test mgr",
        email: "test@gmail.com"
      },
      ownership: [
        {
          kerberosID: "Tester 2",
          name: "Tester 001",
          email: "test@gmail.com",
          primary: true
        }
      ],
      timestamp: {
        createdAt: date,
        createdBy: {
          kerberosID: "tester 1",
          name: "Tester 007",
          email: "test@gmail.com"
        }
      }
    };
  }
}

export const TestMock = new TestMocks().mocks;
