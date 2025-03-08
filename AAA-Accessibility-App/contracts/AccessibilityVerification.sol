// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AccessibilityVerification
 * @dev Smart contract for verifying WCAG 2.1 AAA compliance of digital content
 */
contract AccessibilityVerification {
    // Contract owner
    address public owner;
    
    // Verification record structure
    struct VerificationRecord {
        string contentHash;     // SHA-256 hash of the content being verified
        string ipfsCid;         // IPFS Content Identifier for the full report
        string wcagLevel;       // WCAG compliance level (A, AA, AAA)
        uint256 timestamp;      // Timestamp of verification
        address verifier;       // Address that performed the verification
        bool isValid;           // Whether the verification is currently valid
    }
    
    // Mapping from content hash to verification record
    mapping(string => VerificationRecord) public verifications;
    
    // Array of all content hashes for enumeration
    string[] public contentHashes;
    
    // Events
    event VerificationAdded(string contentHash, string ipfsCid, string wcagLevel, address verifier);
    event VerificationRevoked(string contentHash, address revoker);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }
    
    /**
     * @dev Constructor sets the contract owner
     */
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Add a new verification record
     * @param contentHash SHA-256 hash of the content being verified
     * @param ipfsCid IPFS Content Identifier for the full report
     * @param wcagLevel WCAG compliance level (A, AA, AAA)
     */
    function addVerification(
        string memory contentHash,
        string memory ipfsCid,
        string memory wcagLevel
    ) public {
        // Ensure content hash doesn't already exist or is invalid
        require(
            !verifications[contentHash].isValid,
            "Content hash already has a valid verification"
        );
        
        // Create new verification record
        VerificationRecord memory record = VerificationRecord({
            contentHash: contentHash,
            ipfsCid: ipfsCid,
            wcagLevel: wcagLevel,
            timestamp: block.timestamp,
            verifier: msg.sender,
            isValid: true
        });
        
        // Add to mapping and array if new
        if (bytes(verifications[contentHash].contentHash).length == 0) {
            contentHashes.push(contentHash);
        }
        
        verifications[contentHash] = record;
        
        // Emit event
        emit VerificationAdded(contentHash, ipfsCid, wcagLevel, msg.sender);
    }
    
    /**
     * @dev Revoke an existing verification
     * @param contentHash SHA-256 hash of the content to revoke verification for
     */
    function revokeVerification(string memory contentHash) public onlyOwner {
        // Ensure verification exists and is valid
        require(
            verifications[contentHash].isValid,
            "No valid verification found for this content hash"
        );
        
        // Mark as invalid
        verifications[contentHash].isValid = false;
        
        // Emit event
        emit VerificationRevoked(contentHash, msg.sender);
    }
    
    /**
     * @dev Get verification details for a content hash
     * @param contentHash SHA-256 hash of the content to get verification for
     * @return VerificationRecord The verification record
     */
    function getVerification(string memory contentHash) public view returns (VerificationRecord memory) {
        return verifications[contentHash];
    }
    
    /**
     * @dev Check if a content hash has a valid verification
     * @param contentHash SHA-256 hash of the content to check
     * @return bool Whether the content has a valid verification
     */
    function isVerified(string memory contentHash) public view returns (bool) {
        return verifications[contentHash].isValid;
    }
    
    /**
     * @dev Get the total number of verifications (including revoked ones)
     * @return uint256 The total number of verifications
     */
    function getVerificationCount() public view returns (uint256) {
        return contentHashes.length;
    }
    
    /**
     * @dev Transfer ownership of the contract
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        owner = newOwner;
    }
} 