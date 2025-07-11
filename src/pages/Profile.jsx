
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Settings, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import ProfileSection from '../components/profile/ProfileSection';
import EditableField from '../components/profile/EditableField';
import PasswordModal from '../components/profile/PasswordModal';
import RoleSelectionModal from '../components/profile/RoleSelectionModal';
import TermsOfService from '../components/profile/TermsOfService';
import { createPageUrl } from '@/utils'; // Imported as per outline
import { Link } from 'react-router-dom';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState({
    username: '',
    fullName: '',
    birthdate: '',
    gender: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    role: '',
    servicesOffered: '',
    ageGroups: '',
    programsEnrolled: '',
    profileImage: null
  });

  const [editingSections, setEditingSections] = useState({
    account: false,
    personal: false,
    location: false,
    coaching: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false); // New state for role modal

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    const user = await User.me();
    setCurrentUser(user);

    // Map user data to profile data structure
    setProfileData({
      username: user.email?.split('@')[0] || '',
      fullName: user.full_name || '',
      birthdate: user.birthdate || '',
      gender: user.gender || '',
      email: user.email || '',
      streetAddress: user.street_address || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zip_code || '',
      country: user.country || 'United States',
      role: user.user_type || '',
      servicesOffered: user.specialties?.join(', ') || '',
      ageGroups: user.age_groups || '',
      programsEnrolled: user.programs_enrolled || '',
      profileImage: user.profile_image || null
    });

    setIsLoading(false);
  };

  const handleRoleSelection = async (role) => {
    if (!role) return;

    setIsLoading(true);
    try {
      await User.updateMyUserData({ user_type: role });
      updateProfileData('role', role);

      // Redirect to dashboard after role change
      window.location.href = createPageUrl('Dashboard');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('There was an error updating your role. Please try again.');
      setIsLoading(false); // Make sure to reset loading state on error
    }
  };

  const updateProfileData = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const setEditingSection = (section, isEditing) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: isEditing
    }));
  };

  const saveSection = async (sectionName) => {
    try {
      // Here you would save to the backend
      console.log(`Saving ${sectionName} section:`, profileData);

      // For now, just update local state
      if (currentUser) {
        await User.updateMyUserData({
          full_name: profileData.fullName,
          birthdate: profileData.birthdate,
          gender: profileData.gender,
          street_address: profileData.streetAddress,
          city: profileData.city,
          state: profileData.state,
          zip_code: profileData.zipCode,
          country: profileData.country,
          user_type: profileData.role,
          specialties: profileData.servicesOffered.split(', ').filter(s => s.trim()),
          age_groups: profileData.ageGroups,
          programs_enrolled: profileData.programsEnrolled,
          profile_image: profileData.profileImage
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handlePasswordChange = ({ currentPassword, newPassword }) => {
    console.log('Password change requested');
    // Implement password change logic here
  };

  const handleLogout = async () => {
    try {
      await User.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onOpenChange={setIsRoleModalOpen}
        onSelectRole={handleRoleSelection}
      />
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Profile Avatar */}
        <ProfileAvatar
          profileImage={profileData.profileImage}
          fullName={profileData.fullName}
          onImageChange={(image) => updateProfileData('profileImage', image)}
        />

        {/* Account Information */}
        <ProfileSection
          title="Account Information"
          isEditing={editingSections.account}
          setIsEditing={(editing) => setEditingSection('account', editing)}
          onSave={() => saveSection('account')}
        >
          <EditableField
            label="Username"
            value={profileData.username}
            onChange={(value) => updateProfileData('username', value)}
            isEditing={editingSections.account}
            placeholder="Enter username"
          />

          {/* Title/Role Field */}
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-600 mb-1 block">Title</Label>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="w-full text-left flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <p className="text-gray-900 font-medium capitalize flex items-center">
                {profileData.role === 'coach' && <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />}
                {profileData.role || 'Not set'}
              </p>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {!editingSections.account && (
            <div className="mb-4">
              <PasswordModal onPasswordChange={handlePasswordChange} />
            </div>
          )}
        </ProfileSection>

        {/* Personal Details */}
        <ProfileSection
          title="Personal Details"
          isEditing={editingSections.personal}
          setIsEditing={(editing) => setEditingSection('personal', editing)}
          onSave={() => saveSection('personal')}
        >
          <EditableField
            label="Full Name"
            value={profileData.fullName}
            onChange={(value) => updateProfileData('fullName', value)}
            isEditing={editingSections.personal}
            placeholder="Enter your full name"
          />
          <EditableField
            label="Birth Date"
            value={profileData.birthdate}
            onChange={(value) => updateProfileData('birthdate', value)}
            isEditing={editingSections.personal}
            type="date"
          />
          <EditableField
            label="Gender"
            value={profileData.gender}
            onChange={(value) => updateProfileData('gender', value)}
            isEditing={editingSections.personal}
            type="select"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'prefer_not_to_say', label: 'Prefer not to say' }
            ]}
            placeholder="Select gender"
          />
          <EditableField
            label="Email"
            value={profileData.email}
            onChange={(value) => updateProfileData('email', value)}
            isEditing={editingSections.personal}
            type="email"
            placeholder="Enter email address"
          />
        </ProfileSection>

        {/* Location */}
        <ProfileSection
          title="Location"
          isEditing={editingSections.location}
          setIsEditing={(editing) => setEditingSection('location', editing)}
          onSave={() => saveSection('location')}
        >
          <EditableField
            label="Street Address"
            value={profileData.streetAddress}
            onChange={(value) => updateProfileData('streetAddress', value)}
            isEditing={editingSections.location}
            placeholder="Enter street address"
          />
          <EditableField
            label="City"
            value={profileData.city}
            onChange={(value) => updateProfileData('city', value)}
            isEditing={editingSections.location}
            placeholder="Enter city"
          />
          <EditableField
            label="State"
            value={profileData.state}
            onChange={(value) => updateProfileData('state', value)}
            isEditing={editingSections.location}
            placeholder="Enter state"
          />
          <EditableField
            label="Zip Code"
            value={profileData.zipCode}
            onChange={(value) => updateProfileData('zipCode', value)}
            isEditing={editingSections.location}
            placeholder="Enter zip code"
          />
          <EditableField
            label="Country"
            value={profileData.country}
            onChange={(value) => updateProfileData('country', value)}
            isEditing={editingSections.location}
            placeholder="Enter country"
          />
        </ProfileSection>

        {/* Coaching/Athlete Info */}
        <ProfileSection
          title={profileData.role === 'coach' ? 'Coaching Information' : 'Athlete Information'}
          isEditing={editingSections.coaching}
          setIsEditing={(editing) => setEditingSection('coaching', editing)}
          onSave={() => saveSection('coaching')}
        >
          {profileData.role === 'coach' ? (
            <>
              <EditableField
                label="Services Offered"
                value={profileData.servicesOffered}
                onChange={(value) => updateProfileData('servicesOffered', value)}
                isEditing={editingSections.coaching}
                placeholder="e.g., Tennis, Fitness Training"
              />
              <EditableField
                label="Age Groups Coached"
                value={profileData.ageGroups}
                onChange={(value) => updateProfileData('ageGroups', value)}
                isEditing={editingSections.coaching}
                placeholder="e.g., Adults, Teens, Children"
              />
            </>
          ) : (
            <EditableField
              label="Programs Enrolled"
              value={profileData.programsEnrolled}
              onChange={(value) => updateProfileData('programsEnrolled', value)}
              isEditing={editingSections.coaching}
              placeholder="e.g., Tennis Academy, Fitness Program"
            />
          )}
        </ProfileSection>
        
        {/* Terms of Service */}
        <TermsOfService />
      </div>
    </>
  );
}
