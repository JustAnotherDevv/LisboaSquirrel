// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrganizationSheet {
	//      ------      STRUCTS      ------     //
	struct Organization {
		address[] admins;
		address[] users;
		voteCriteria[] approvedCriteria;
		mapping(string => bool) criteriaNames;
		string name;
		string imgUrl;
		string website;
		string github;
		uint256 tokenAmountEstimation;
		uint256 votePeriodAmount;
		votePeriod[] votingPeriods;
	}

	struct votePeriod {
		bool isActive;
		uint256 startDate;
		uint256 endDate;
	}

	struct voteCriteria {
		string name;
		uint32 range;
	}

	//      ------      MAPPINGS      ------     //
	mapping(uint256 => Organization) public organizations;
	mapping(string => bool) public registeredNames;
	// Mapping 		=	OrganizationId 	->	vestingPeriodId	->	admin address	->	votedUser address => voteCriteria
	mapping(uint256 => mapping(uint256 => mapping(address => mapping(address => mapping(uint256 => voteCriteria))))) adminVotes;
	uint256 public organizationAmount;

	//      ------      EVENTS      ------     //
	event OrganizationCreated(
		address indexed admin,
		uint256 indexed organization,
		string name
	);
	event UserAdded(address indexed user, uint256 indexed organization);
	event AdminAdded(address indexed admin, uint256 indexed organization);

	//      ------      MODIFIERS      ------     //
	modifier onlySuperAdmin(uint256 organization) {
		require(
			isOrganizationAdmin(organization, msg.sender),
			"You do not have the necessary rights."
		);
		_;
	}

	//      ------      FRONTEND GETTERS      ------     //
	function getOrganizations(
		address _address
	) public view returns (uint256[] memory, uint256[] memory) {
		uint256 adminCount = 0;
		uint256 userCount = 0;
		for (uint256 i = 0; i < organizationAmount; i++) {
			if (isAddressInArray(_address, organizations[i].admins)) {
				adminCount++;
			}
			if (isAddressInArray(_address, organizations[i].users)) {
				userCount++;
			}
		}

		uint256[] memory adminOrgs = new uint256[](adminCount);
		uint256[] memory userOrgs = new uint256[](userCount);
		adminCount = 0;
		userCount = 0;

		for (uint256 i = 0; i < organizationAmount; i++) {
			if (isAddressInArray(_address, organizations[i].admins)) {
				adminOrgs[adminCount] = i;
				adminCount++;
			}
			if (isAddressInArray(_address, organizations[i].users)) {
				userOrgs[userCount] = i;
				userCount++;
			}
		}
		return (adminOrgs, userOrgs);
	}

	function isAddressInArray(
		address _address,
		address[] memory _array
	) private pure returns (bool) {
		for (uint256 i = 0; i < _array.length; i++) {
			if (_array[i] == _address) {
				return true;
			}
		}
		return false;
	}

	modifier onlyAdminOrUser(uint256 organization) {
		require(
			isUserInOrganization(organization, msg.sender) ||
				isOrganizationAdmin(organization, msg.sender),
			"You do not have the necessary rights."
		);
		_;
	}

	constructor() {}

	//      ------      ORGANIZATION FUNCTIONS      ------     //

	function createOrganization(
		string memory _name,
		string memory _imgUrl,
		string memory _website,
		string memory _github,
		uint256 _tokenAmountEstimation
	) public {
		require(
			organizations[organizationAmount].admins.length == 0,
			"You already have an organization."
		);
		require(
			!registeredNames[_name],
			"Organization with this name have already been registered."
		);
		Organization storage newOrg = organizations[organizationAmount];
		newOrg.admins.push(msg.sender);
		newOrg.name = _name;
		newOrg.imgUrl = _imgUrl;
		newOrg.website = _website;
		newOrg.github = _github;
		newOrg.tokenAmountEstimation = _tokenAmountEstimation;
		registeredNames[_name] = true;

		approveCriteria(organizationAmount, "Time", 4);
		approveCriteria(organizationAmount, "Impact", 3);
		approveCriteria(organizationAmount, "Reliability", 3);
		approveCriteria(organizationAmount, "Team", 15);
		approveCriteria(organizationAmount, "Cofounder", 15);

		organizationAmount++;

		emit OrganizationCreated(msg.sender, organizationAmount, _name);
	}

	function editOrganization(
		uint256 organization,
		string memory _name,
		string memory _imgUrl,
		string memory _website,
		string memory _github,
		uint256 _tokenAmountEstimation
	) public onlySuperAdmin(organization) {
		require(
			organizations[organization].admins.length != 0,
			"No organization with this id."
		);
		require(
			registeredNames[_name],
			"Organization with this name doesn't exist."
		);
		Organization storage newOrg = organizations[organizationAmount];
		newOrg.name = _name;
		newOrg.imgUrl = _imgUrl;
		newOrg.website = _website;
		newOrg.github = _github;
		newOrg.tokenAmountEstimation = _tokenAmountEstimation;
		registeredNames[_name] = true;
		// ToDo organization edited event emit
	}

	function getCriteriaAmount(
		uint256 organization
	) public view returns (uint256) {
		return organizations[organization].approvedCriteria.length;
	}

	function getCriteriaAtIndex(
		uint256 organization,
		uint256 index
	) public view returns (voteCriteria memory result) {
		require(
			index < organizations[organization].approvedCriteria.length,
			"Index out of bounds."
		);
		return organizations[organization].approvedCriteria[index];
	}

	function getCriteriaIdInOrganization(
		uint256 organization,
		string memory criteriaName
	) public view returns (uint256) {
		Organization storage org = organizations[organization];
		for (uint256 i = 0; i < uint256(org.approvedCriteria.length); i++) {
			if (
				keccak256(
					abi.encodePacked(org.approvedCriteria[uint256(i)].name)
				) == keccak256(abi.encodePacked(criteriaName))
			) {
				return i;
			}
		}

		revert("Criteria not found in the organization");
	}

	function approveCriteria(
		uint256 organization,
		string memory _name,
		uint32 _range
	) public onlySuperAdmin(organization) {
		require(
			organizations[organization].admins.length != 0,
			"No organization with this id."
		);
		Organization storage org = organizations[organization];
		// org.approvedCriteria.push(_name, _range);
		voteCriteria memory newCriteria = voteCriteria(_name, _range);
        org.approvedCriteria.push(newCriteria);
		// org.users.push(user);
		org.criteriaNames[_name] = true;
		// ToDo criteria approved event emit
	}

	function removeCriteria(
		uint256 organization,
		string memory name
	) public onlySuperAdmin(organization) {
		require(
			organizations[organization].admins.length != 0,
			"No organization with this id."
		);
		Organization storage org = organizations[organization];
		uint256 criteriaId = getCriteriaIdInOrganization(organization, name);
		org.approvedCriteria[criteriaId] = org.approvedCriteria[
			org.users.length - 1
		];
		org.approvedCriteria.pop();
		org.criteriaNames[name] = false;
		// ToDo criteria removed event emit
	}

	//      ------      TOKEN ALLOCATION FUNCTIONS      ------     //

	function getAllocationPeriodById(
		uint256 organization,
		uint256 index
	)
		public
		view
		onlySuperAdmin(organization)
		returns (votePeriod memory result)
	{
		require(
			index < organizations[organization].votingPeriods.length,
			"Index out of bounds."
		);
		return organizations[organization].votingPeriods[index];
	}

	// function editAllocationPeriodData(uint256 organization) public onlySuperAdmin(organization) {
	// ToDo - implement this function if needed
	// }

	function startAllocationPeriod(
		uint256 organization,
		uint256 timestamp
	) public onlySuperAdmin(organization) {
		require(
			organizations[organization].admins.length != 0,
			"No organization with this id."
		);
		Organization storage org = organizations[organizationAmount];
		if (org.votePeriodAmount != 0) {
			require(
				!org.votingPeriods[org.votePeriodAmount - 1].isActive,
				"Can't add new voting period before finishing the previous one."
			);
		}
		org.votingPeriods.push(votePeriod(true, timestamp, 0));
		org.votePeriodAmount++;
	}

	function voteAllocationPeriod(
		uint256 organization,
		uint256 votePeriodIndex,
		address _votedOnUser,
		// uint256 criteriaIndex,
		voteCriteria[] memory criterias
		// string memory note,
		// uint32 rating
	) public onlySuperAdmin(organization) {
		// ToDo - change it so that user can vote on all criterias in 1 tx
		require(
			organizations[organization].admins.length != 0,
			"No organization with this id exists."
		);
		Organization storage org = organizations[organizationAmount];
		require(
			org.votingPeriods[votePeriodIndex].isActive,
			"Allocation period has to be active."
		);
		// require(
		// 	criteriaIndex < getCriteriaAmount(organization),
		// 	"Allocation period has to be active."
		// );

		for(uint256 i = 0; i != criterias.length; i++) {
			require(
			org.approvedCriteria[votePeriodIndex].range >= criterias[i].range,
			"Rating cannot be higher than range for given criteria."
		);
			adminVotes[organization][votePeriodIndex][msg.sender][_votedOnUser][
				i
			] = criterias[i];
		}
	}

	// function voteAllocationPeriod(
	// 	uint256 organization,
	// 	uint256 votePeriodIndex,
	// 	address _votedOnUser,
	// 	uint256 criteriaIndex,
	// 	string memory note,
	// 	uint32 rating
	// ) public onlySuperAdmin(organization) {
	// 	// ToDo - change it so that user can vote on all criterias in 1 tx
	// 	require(
	// 		organizations[organization].admins.length != 0,
	// 		"No organization with this id."
	// 	);
	// 	Organization storage org = organizations[organizationAmount];
	// 	require(
	// 		org.votingPeriods[votePeriodIndex].isActive,
	// 		"Allocation period has to be active."
	// 	);
	// 	require(
	// 		org.approvedCriteria[votePeriodIndex].range >= rating,
	// 		"Rating cannot be higher than range for given criteria."
	// 	);
	// 	require(
	// 		criteriaIndex < getCriteriaAmount(organization),
	// 		"Allocation period has to be active."
	// 	);

	// 	adminVotes[organization][votePeriodIndex][msg.sender][_votedOnUser][
	// 		criteriaIndex
	// 	] = voteCriteria({ name: note, range: rating });
	// }

	function endAllocationPeriod(
		uint256 organization,
		uint256 index,
		uint256 timestamp
	) public onlySuperAdmin(organization) {
		require(
			organizations[organization].admins.length != 0,
			"No organization with this id."
		);
		Organization storage org = organizations[organizationAmount];
		require(
			org.votingPeriods[index].isActive,
			"Allocation period has to be active."
		);
		// check if every cofounder / admin voted already for every criteria for every user or abstained for those
		for (uint256 i = 0; i != getAdminAmount(organization); i++) {
			for (uint256 j = 0; j != getUserAmount(organization); j++) {
				for (uint256 k = 0; k != getCriteriaAmount(organization); k++) {
					adminVotes[organization][org.votingPeriods.length - 1][
						org.admins[i]
					][org.users[j]][k];
				}
			}
		}
		org.votingPeriods[index].isActive = false;
		org.votingPeriods[index].endDate = timestamp;
	}

	//      ------      ROLE FUNCTIONS      ------     //
	function getAdminAmount(
		uint256 organization
	) public view returns (uint256) {
		return organizations[organization].admins.length;
	}

	function getUserAmount(uint256 organization) public view returns (uint256) {
		return organizations[organization].users.length;
	}

	function getAdminAtIndex(
		uint256 organization,
		uint256 index
	) public view returns (address) {
		require(
			index < organizations[organization].admins.length,
			"Index out of bounds"
		);
		return organizations[organization].admins[index];
	}

	function getUserAtIndex(
		uint256 organization,
		uint256 index
	) public view returns (address) {
		require(
			index < organizations[organization].users.length,
			"Index out of bounds"
		);
		return organizations[organization].users[index];
	}

	function getUserIdInOrganization(
		uint256 organization,
		address user
	) public view returns (uint256) {
		Organization storage org = organizations[organization];
		for (uint256 i = 0; i < org.users.length; i++) {
			if (org.users[i] == user) {
				return i;
			}
		}
		revert("User not found in the organization");
	}

	function getAdminIdInOrganization(
		uint256 organization,
		address admin
	) public view returns (uint256) {
		Organization storage org = organizations[organization];
		for (uint256 i = 0; i < org.admins.length; i++) {
			if (org.admins[i] == admin) {
				return i;
			}
		}
		revert("Admin not found in the organization");
	}

	function addUserToOrganization(
		uint256 organization,
		address user
	) public onlySuperAdmin(organization) {
		Organization storage org = organizations[organization];
		require(
			!isUserInOrganization(organization, user),
			"User is already part of this organization."
		);
		org.users.push(user);
		emit UserAdded(user, organization);
	}

	function removeUserFromOrganization(
		uint organization,
		address user
	) public onlySuperAdmin(organization) {
		Organization storage org = organizations[organization];
		uint256 userId = getUserIdInOrganization(organization, user);
		org.users[userId] = org.users[org.users.length - 1];
		org.users.pop();
	}

	function addAdminToOrganization(
		uint256 organization,
		address admin
	) public onlySuperAdmin(organization) {
		Organization storage org = organizations[organization];
		require(
			!isOrganizationAdmin(organization, admin),
			"Admin is already part of this organization."
		);
		org.admins.push(admin);
		emit AdminAdded(admin, organization);
	}

	function removeAdminFromOrganization(
		uint256 organization,
		address admin
	) public onlySuperAdmin(organization) {
		require(
			organizations[organizationAmount].admins.length != 1,
			"Can't remove last admin from organization"
		);
		require(
			isOrganizationAdmin(organization, admin),
			"User has top be admin to remove himself from admin list."
		);
		require(
			msg.sender == admin,
			"Only admin can remove himself from organization."
		);

		Organization storage org = organizations[organization];
		uint256 adminId = getUserIdInOrganization(organization, admin);
		org.users[adminId] = org.users[org.admins.length - 1];
		org.admins.pop();
	}

	function isUserInOrganization(
		uint256 organization,
		address user
	) public view returns (bool) {
		Organization storage org = organizations[organization];
		for (uint256 i = 0; i < org.users.length; i++) {
			if (org.users[i] == user) {
				return true;
			}
		}
		return false;
	}

	function isOrganizationAdmin(
		uint256 organization,
		address admin
	) public view returns (bool) {
		Organization storage org = organizations[organization];
		for (uint256 i = 0; i < org.admins.length; i++) {
			if (org.admins[i] == admin) {
				return true;
			}
		}
		return false;
	}
}
