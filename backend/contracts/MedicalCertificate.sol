// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MedicalCertificate is Ownable {
    struct Patient {
        string name;
        uint256 patientId;
        uint256[] patientMCIds;
    }

    struct Doctor {
        string name;
        uint crm;
        address doctorAddress;
    }

    struct Certificate {
        string description;
        uint date;
        string referenceUrl;
        uint256 certificateId;
        string ipfsHash;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(uint256 => Patient) public patients;
    mapping(uint256 => string) public certificateIPFSHashes;
    mapping(address => Doctor) public doctors;

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

    function addDoctor(
        string memory _name,
        uint _crm,
        address _doctorAddress
    ) public onlyOwner {
        doctors[_doctorAddress] = Doctor({
            name: _name,
            crm: _crm,
            doctorAddress: _doctorAddress
        });
    }

    function addCertificate(
        string memory _description,
        uint _date,
        string memory _referenceUrl,
        uint256 _patientId,
        string memory _ipfsHash
    ) public {
        //require(doctors[msg.sender].doctorAddress == msg.sender, "Somente medicos podem adicionar certificados.");
        uint256 certificateId = nextCertificateId;
        certificates[certificateId] = Certificate({
            description: _description,
            date: _date,
            referenceUrl: _referenceUrl,
            certificateId: certificateId,
            ipfsHash: _ipfsHash
        });

        patients[_patientId].patientMCIds.push(certificateId);
        nextCertificateId++;
    }

    function getPatientCertificates(
        uint256 _patientId
    ) public view returns (Certificate[] memory) {
        uint256[] memory patientCertificates = patients[_patientId]
            .patientMCIds;
        Certificate[] memory result = new Certificate[](
            patientCertificates.length
        );

        for (uint i = 0; i < patientCertificates.length; i++) {
            result[i] = certificates[patientCertificates[i]];
        }

        return result;
    }

    function getPatientName(
        uint256 _patientId
    ) public view returns (string memory) {
        return patients[_patientId].name;
    }

    function removeCertificate(uint256 _certificateId) public onlyOwner {
        require(
            certificates[_certificateId].certificateId == _certificateId,
            "Atestado nao encontrado"
        );

        uint256 patientId = findPatientByCertificateId(_certificateId);

        removeCertificateFromPatient(_certificateId, patientId);

        delete certificateIPFSHashes[_certificateId];
        delete certificates[_certificateId];
    }

    function findPatientByCertificateId(
        uint256 _certificateId
    ) internal view returns (uint256) {
        for (
            uint256 i = 0;
            i < patients[nextPatientId].patientMCIds.length;
            i++
        ) {
            if (patients[nextPatientId].patientMCIds[i] == _certificateId) {
                return nextPatientId;
            }
        }
        revert("Paciente nao encontrado para o atestado");
    }

    function removeCertificateFromPatient(
        uint256 _certificateId,
        uint256 _patientId
    ) internal {
        uint256[] storage patientCertificates = patients[_patientId]
            .patientMCIds;

        for (uint256 i = 0; i < patientCertificates.length; i++) {
            if (patientCertificates[i] == _certificateId) {
                patientCertificates[i] = patientCertificates[
                    patientCertificates.length - 1
                ];
                patientCertificates.pop();
                return;
            }
        }

        revert("Atestado nao encontrado para o paciente");
    }
}
