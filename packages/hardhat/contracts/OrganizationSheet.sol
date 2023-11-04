// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrganizationSheet {

    //      ------      STRUCTS      ------     //
    struct Organization {
        address[] admins;
        address[] users;
        voteCriteria[] approvedCriteria;
        string name;
    }

    struct votePeriod {
        bool isActive;
        uint256 startDate;
        uint256 endDate;
        mapping (address => voteCriteria[]) adminVotes;
    }

    struct voteCriteria {
        string name;
        uint32 range;
    }

    //      ------      MAPPINGS      ------     //
    mapping(uint256 => Organization) public organizations;
    uint256 public organizationAmount;
    mapping(string => bool) public registeredNames;

    //      ------      EVENTS      ------     //
    event OrganizationCreated(address indexed admin, string name);
    event UserAdded(address indexed user, uint256 indexed organization);
    event AdminAdded(address indexed admin, uint256 indexed organization);
    event SuperAdminAdded(address indexed superAdmin);

    //      ------      MODIFIERS      ------     //
    modifier onlySuperAdmin(uint256 organization) {
        require(
            isOrganizationAdmin(organization, msg.sender),
            "You do not have the necessary rights."
        );
        _;
    }

    modifier onlyAdminOrUser(uint256 organization) {
        require(
            isUserInOrganization(organization, msg.sender) || isOrganizationAdmin(organization, msg.sender),
            "You do not have the necessary rights."
        );
        _;
    }

    constructor() {}

    //      ------      ORGANIZATION FUNCTIONS      ------     //

    function createOrganization(string memory _name) public {
        require(organizations[organizationAmount].admins.length == 0, "You already have an organization.");
        require(!registeredNames[_name], "Organization with this name have already been registered");

        Organization storage newOrg = organizations[organizationAmount];
        newOrg.admins.push(msg.sender);
        newOrg.name = _name;
        registeredNames[_name] = true;
        organizationAmount++;

        emit OrganizationCreated(msg.sender, _name);
    }

    function editOrganization(uint256 organization, string memory _name) public onlySuperAdmin(organization) {
        require(organizations[organizationAmount].admins.length != 0, "No organization with this ide");
        require(registeredNames[_name], "Organization with this name doesn't exist");
        Organization storage newOrg = organizations[organizationAmount];
        newOrg.name = _name;
        registeredNames[_name] = true;
        // ToDo organization edited event emit
    }

    //      ------      TOKEN ALLOCATION FUNCTIONS      ------     //
    
    function startAllocationPeriod(uint256 organization) public onlySuperAdmin(organization) {

    }
    
    //      ------      ROLE FUNCTIONS      ------     //
    function getAdminAmount(uint256 organization) public view returns (uint256) {
        return organizations[organization].admins.length;
    }

    function getUserAmount(uint256 organization) public view returns (uint256) {
        return organizations[organization].users.length;
    }

    function getAdminAtIndex(uint256 organization, uint256 index) public view returns (address) {
        require(index < organizations[organization].admins.length, "Index out of bounds");
        return organizations[organization].admins[index];
    }

    function getUserAtIndex(uint256 organization, uint256 index) public view returns (address) {
        require(index < organizations[organization].users.length, "Index out of bounds");
        return organizations[organization].users[index];
    }

    function getUserIdInOrganization(uint256 organization, address user) public view returns (uint256) {
        Organization storage org = organizations[organization];
        for (uint256 i = 0; i < org.users.length; i++) {
            if (org.users[i] == user) {
                return i;
            }
        }
        revert("User not found in the organization");
    }

    function getAdminIdInOrganization(uint256 organization, address admin) public view returns (uint256) {
        Organization storage org = organizations[organization];
        for (uint256 i = 0; i < org.admins.length; i++) {
            if (org.admins[i] == admin) {
                return i;
            }
        }
        revert("Admin not found in the organization");
    }

    function addUserToOrganization(uint256 organization, address user) public onlySuperAdmin(organization) {
        Organization storage org = organizations[organization];
        require(!isUserInOrganization(organization, user), "User is already part of this organization.");
        org.users.push(user);
        emit UserAdded(user, organization);
    }

    function removeUserFromOrganization(uint organization, address user) public onlySuperAdmin(organization) {
        Organization storage org = organizations[organization];
        uint256 userId = getUserIdInOrganization(organization, user);
        org.users[userId] = org.users[org.users.length - 1];
        org.users.pop();
  }

    function addAdminToOrganization(uint256 organization, address admin) public onlySuperAdmin(organization) {
        Organization storage org = organizations[organization];
        require(!isOrganizationAdmin(organization, admin), "Admin is already part of this organization.");
        org.admins.push(admin);
        emit AdminAdded(admin, organization);
    }

    function removeAdminFromOrganization(uint256 organization, address admin) public onlySuperAdmin(organization) {
        require(organizations[organizationAmount].admins.length != 1, "Can't remove last admin from organization");
        require(isOrganizationAdmin(organization, admin), "User has top be admin to remove himself from admin list.");
        require(msg.sender == admin, "Only admin can remove himself from organization.");

        Organization storage org = organizations[organization];
        uint256 adminId = getUserIdInOrganization(organization, admin);
        org.users[adminId] = org.users[org.admins.length - 1];
        org.admins.pop();
    }

    function isUserInOrganization(uint256 organization, address user) public view returns (bool) {
        Organization storage org = organizations[organization];
        for (uint256 i = 0; i < org.users.length; i++) {
            if (org.users[i] == user) {
                return true;
            }
        }
        return false;
    }

    function isOrganizationAdmin(uint256 organization, address admin) public view returns (bool) {
        Organization storage org = organizations[organization];
        for (uint256 i = 0; i < org.admins.length; i++) {
            if (org.admins[i] == admin) {
                return true;
            }
        }
        return false;
    }
}
