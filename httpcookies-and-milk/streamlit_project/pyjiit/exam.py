from dataclasses import dataclass
import requests

@dataclass
class ExamEvent:
    """Class containing exam event info"""
    exam_event_code: str
    event_from: int
    exam_event_desc: str
    registration_id: str
    exam_event_id: str

    @staticmethod
    def from_json(resp: dict):
        return ExamEvent(
            resp["exameventcode"],
            resp["eventfrom"],
            resp["exameventdesc"],
            resp["registrationid"],
            resp["exameventid"]
        )

class JIITWebPortal:
    def __init__(self, session):
        self.session = session
        self.api_base = "https://webportal.jiit.ac.in:6011/StudentPortalAPI"  # Replace with the actual API base URL

    def __hit(self, method, endpoint, json=None, authenticated=False):
        url = f"{self.api_base}{endpoint}"
        headers = {}
        if authenticated:
            headers["Authorization"] = f"Bearer {self.session['token']}"  # Adjust based on actual auth method
        response = requests.request(method, url, json=json, headers=headers)
        response.raise_for_status()
        return response.json()

    def __get_semester_number(self):
        endpoint = "/studentsgpacgpa/checkIfstudentmasterexist"
        payload = {
            "name": self.session["name"],
            "enrollmentno": self.session["enrollmentno"],
        }
        resp = self.__hit("POST", endpoint, json=payload, authenticated=True)
        return resp["response"]["studentlov"]["currentsemester"]

    def get_sgpa_cgpa(self):
        endpoint = "/studentsgpacgpa/getallsemesterdata"
        stynumber = self.__get_semester_number()
        payload = {
            "name": self.session["name"],
            "enrollmentno": self.session["enrollmentno"],
            "stynumber": stynumber,
        }
        resp = self.__hit("POST", endpoint, json=payload, authenticated=True)
        return resp["response"]
