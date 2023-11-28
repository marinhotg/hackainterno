// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MedicalCertificate is Ownable {
    struct Doctor {
        string name;
        uint crm;
        address doctorAddress;
    }

    struct Certificate {
        string patientName;
        string description;
        uint256 certificateId;
        address doctorAddress;
        string ipfsHash;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(uint256 => string) public certificateIPFSHashes;
    mapping(address => Doctor) public doctors;

    uint256 public nextCertificateId;
    uint256 public nextPatientId;

    constructor() {
        nextCertificateId = 1;
        nextPatientId = 1;
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
        string memory _patientName,
        string memory _description,
        string memory _ipfsHash
    ) public {
        //require(doctors[msg.sender].doctorAddress == msg.sender, "Somente medicos podem adicionar atestados.");
        address _doctorAddress = msg.sender;
        uint256 certificateId = nextCertificateId;
        certificates[certificateId] = Certificate({
            patientName: _patientName,
            description: _description,
            certificateId: certificateId,
            doctorAddress: _doctorAddress,
            ipfsHash: _ipfsHash
        });

        nextCertificateId++;
    }

    function removeCertificate(uint256 _certificateId) public onlyOwner {
        require(
            certificates[_certificateId].certificateId == _certificateId,
            "Atestado nao encontrado"
        );

        delete certificateIPFSHashes[_certificateId];
        delete certificates[_certificateId];
    }

    function getCertificateByIpfsHash(
        string memory _ipfsHash
    ) public view returns (string memory) {
        for (uint256 i = 1; i < nextCertificateId; i++) {
            if (
                certificates[i].certificateId != 0 &&
                keccak256(abi.encodePacked(certificates[i].ipfsHash)) ==
                keccak256(abi.encodePacked(_ipfsHash))
            ) {
                string memory certificateString = string(
                    abi.encodePacked(
                        "Nome do Paciente: ",
                        certificates[i].patientName,
                        "\n",
                        "Descricao: ",
                        certificates[i].description,
                        "\n",
                        "Endereco do Doutor: ",
                        addressToString(certificates[i].doctorAddress),
                        "\n",
                        "IPFS Hash: ",
                        certificates[i].ipfsHash
                    )
                );
                return certificateString;
            }
        }
        return "Atestado nao encontrado para o hash IPFS fornecido";
    }

    function addressToString(
        address _address
    ) internal pure returns (string memory) {
        bytes32 addressBytes = bytes32(uint256(uint160(_address)));
        bytes memory hexChars = "0123456789abcdef";
        bytes memory result = new bytes(42);

        result[0] = "0";
        result[1] = "x";

        for (uint256 i = 0; i < 20; i++) {
            result[2 + i * 2] = hexChars[uint8(addressBytes[i] >> 4)];
            result[3 + i * 2] = hexChars[uint8(addressBytes[i] & 0x0f)];
        }

        return string(result);
    }

    function listCertificates() public view returns (string[] memory) {
        string[] memory certificateList = new string[](nextCertificateId - 1);

        for (uint256 i = 1; i < nextCertificateId; i++) {
            if (certificates[i].certificateId != 0) {
                string memory certificateString = string(
                    abi.encodePacked(
                        "ID do Certificado: ",
                        uintToString(certificates[i].certificateId),
                        "\n",
                        "Nome do Paciente: ",
                        certificates[i].patientName,
                        "\n",
                        "Descricao: ",
                        certificates[i].description,
                        "\n",
                        "Endereco do Doutor: ",
                        addressToString(certificates[i].doctorAddress),
                        "\n",
                        "IPFS Hash: ",
                        certificates[i].ipfsHash
                    )
                );
                certificateList[i - 1] = certificateString;
            }
        }

        return certificateList;
    }

    function uintToString(
        uint256 _value
    ) internal pure returns (string memory) {
        if (_value == 0) {
            return "0";
        }

        uint256 temp = _value;
        uint256 digits;

        while (temp != 0) {
            temp /= 10;
            digits++;
        }

        bytes memory buffer = new bytes(digits);
        while (_value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + (_value % 10)));
            _value /= 10;
        }

        return string(buffer);
    }

    function getNextCertificateId() public view returns (uint256) {
        return nextCertificateId;
    }
}
