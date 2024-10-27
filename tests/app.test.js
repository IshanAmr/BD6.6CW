const { getAllEmployees, getEmployeeById } = require("../controllers/index");
const request = require("supertest");
const http = require('http');
const { app } = require("../index");

jest.mock("../controllers", () => {
    const originalModule = jest.requireActual("../controllers");
    return {
        ...originalModule,
        getAllEmployees: jest.fn(),
        getEmployeeById: jest.fn(),
    };
});

let server;

beforeAll((done) => {
    server = http.createServer(app);
    server.listen(3001, done);
});

afterAll((done) => {
    server.close(done);
});

describe("Controller Function tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return all employees", () => {
        const mockEmployees = [
            {
                employeeId: 1,
                name: 'Kriya Singh',
                email: 'kriya.singh@example.com',
                departmentId: 2,
                roleId: 2,
            },
            {
                employeeId: 2,
                name: 'Talpade Verma',
                email: 'talpade.verma@example.com',
                departmentId: 1,
                roleId: 3,
            }
        ];

        getAllEmployees.mockReturnValue(mockEmployees);

        const results = getAllEmployees();
        expect(results).toEqual(mockEmployees);
        expect(results.length).toBe(2);
    });

    it("should return employee given id", () => {
      const mockEmployee = 
          {
              employeeId: 1,
              name: 'Kriya Singh',
              email: 'kriya.singh@example.com',
              departmentId: 2,
              roleId: 2,
          }

      getEmployeeById.mockReturnValue(mockEmployee);

      const results = getEmployeeById();
      expect(results).toEqual(mockEmployee);
  });
});

describe("API Endpoint tests", () => {
    it("GET /employees should get all employees", async () => {
        const mockEmployees = [
            {
                employeeId: 1,
                name: 'Kriya Singh',
                email: 'kriya.singh@example.com',
                departmentId: 2,
                roleId: 2,
            },
            {
                employeeId: 2,
                name: 'Talpade Verma',
                email: 'talpade.verma@example.com',
                departmentId: 1,
                roleId: 3,
            }
        ];

        getAllEmployees.mockReturnValue(mockEmployees);

        const res = await request(server).get("/employees");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ employees: mockEmployees });
    });

    it("GET /employees/details/:id should get an employee by ID", async () => {
        const mockEmployee = {
            employeeId: 1,
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            departmentId: 1,
            roleId: 1,
        };

        getEmployeeById.mockReturnValue(mockEmployee);

        const res = await request(server).get("/employees/details/1");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ employee: mockEmployee });
    });
});
