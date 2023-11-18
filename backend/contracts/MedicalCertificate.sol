// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MedicalCertificate is AccessControl {

    bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");

    struct Patient {
        string name;
        uint256 patientId;
        uint256[] patientMCIds;
    }

    struct Doctor {
        string name;
        uint crm;
    }

    struct Certificate {
        string description;
        uint date;
        string referenceUrl;
        uint256 certificateId;
        // falta indentificacao do medico
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(uint256 => Patient) public patients;
    uint256 public nextCertificateId;
    uint256 public nextPatientId;

    function addPatient(string memory _name) public {
        uint256 patientId = nextPatientId;
        patients[patientId] = Patient({
            name: _name,
            patientId: patientId,
            patientMCIds: new uint256[](0) 
        });

        nextPatientId++;
    }

    function addCertificate(string memory _description, uint _date, string memory _referenceUrl, uint256 _patientId) public {
        //require(hasRole(DOCTOR_ROLE, msg.sender), "Restricted to doctors");
        uint256 certificateId = nextCertificateId;
        certificates[certificateId] = Certificate({
            description: _description,
            date: _date,
            referenceUrl: _referenceUrl,
            certificateId: certificateId
        });

        patients[_patientId].patientMCIds.push(certificateId);
        nextCertificateId++;
    }

    function getPatientCertificates(uint256 _patientId) public view returns (Certificate[] memory) {
        uint256[] memory patientCertificates = patients[_patientId].patientMCIds;
        Certificate[] memory result = new Certificate[](patientCertificates.length);

        for (uint i = 0; i < patientCertificates.length; i++) {
            result[i] = certificates[patientCertificates[i]];
        }

        return result;
    }
    
    function getPatientName(uint256 _patientId) public view returns (string memory) {
        return patients[_patientId].name;
    }
}