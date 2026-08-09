import { Badge } from '@/components/core/Badge'
import styles from './Settings.module.css'
import { Label } from '@/components/core/Label'
import { Input } from '@/components/core/Input'
import { Select } from '@/components/core/Select'
import { Button } from '@/components/core/Button'
import { Trash2, UserPlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInviteEmp } from './hooks'

export type RoleType =
  'Org Admin' | 'Manager' | 'Housekeeping' | 'Front Desk' | 'Owner' | 'Platform Super Admin'

interface TeamMember {
  name: string
  email: string
  role: RoleType
}

interface SettingsState {
  orgName: string | ''
  legalName: string | ''
  currency: 'USD' | 'EGP'
  timezone: string
  teamMembers: TeamMember[]
}

export default function Settings() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      name: 'Sara Hassan',
      email: 'admin@venvl.dev',
      role: 'Org Admin',
    },
  ])

  const [newMember, setNewMember] = useState<TeamMember>({
    name: '',
    email: '',
    role: 'Front Desk',
  })

  const [settingsState, setSettingsState] = useState<SettingsState>({
    orgName: '',
    legalName: '',
    currency: 'EGP',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    teamMembers: teamMembers,
  })

  const [openInvite, setOpenInvite] = useState(false)

  useEffect(() => {
    setSettingsState((prev) => ({
      ...prev,
      teamMembers: teamMembers,
    }))
  }, [teamMembers])

  const handleInputChange = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettingsState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const changeTeamInfoHandler = <K extends keyof TeamMember>(
    key: K,
    value: TeamMember[K],
    currMember: TeamMember,
  ) => {
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.email === currMember.email ? { ...member, [key]: value } : member,
      ),
    )
  }

  const handleNewMemberInfoChange = <K extends keyof TeamMember>(key: K, value: TeamMember[K]) => {
    setNewMember((prev) => ({ ...prev, [key]: value }))
  }

  const { isPending, mutate } = useInviteEmp()

  const handleNewMemberSubmit = () => {
    if (newMember.name && newMember.email && newMember.role) {
      mutate({ ...newMember, role: 'USER' })
      // setTeamMembers((prev) => [...prev, newMember])
      setNewMember({ name: '', email: '', role: 'Front Desk' })
      setOpenInvite(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Settings</h1>
          <Badge variant="success">MVP</Badge>
          <span className={styles.meta}>PRD $7.5</span>
        </div>
        <p className={styles.subtitle}>Organization profile and team access (RBAC).</p>
      </header>

      <div className={styles.settingsDivider}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <p className={styles.formHeading}>Organization</p>
          </div>
          <div className={styles.formContent}>
            <div className={styles.fieldContainer}>
              <Label className={styles.formLabel}>Name</Label>
              <Input
                onChange={(e) => handleInputChange('orgName', e.target.value)}
                className={styles.inputField}
                value={settingsState.orgName}
                type="text"
                placeholder="Ex: Nile View Rentals"
              />
            </div>
            <div className={styles.fieldContainer}>
              <Label className={styles.formLabel}>Legal Name</Label>
              <Input
                onChange={(e) => handleInputChange('legalName', e.target.value)}
                className={styles.inputField}
                type="text"
                value={settingsState.legalName}
                placeholder="Ex: Nile View Rentals LLC"
              />
            </div>
            <div className={styles.formFieldsCombine}>
              <div className={styles.fieldContainer}>
                <Label className={styles.formLabel}>Currency</Label>
                <Select
                  onChange={(e) => handleInputChange('currency', e.target.value as 'USD' | 'EGP')}
                  value={settingsState.currency}
                  className={styles.formSelection}
                >
                  <option value="USD">USD</option>
                  <option value="EGP">EGP</option>
                </Select>
              </div>
              <div className={styles.fieldContainer}>
                <Label className={styles.formLabel}>Timezone</Label>
                <Select
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  value={settingsState.timezone}
                  className={styles.formSelection}
                >
                  {Intl.supportedValuesOf('timeZone').map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Button className={styles.actionButton} variant="default">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <p className={styles.formHeading}>Team</p>
            <Button onClick={() => setOpenInvite(true)} className={styles.actionButton}>
              <UserPlus /> Invite
            </Button>
          </div>
          <div className={styles.teamMembers}>
            {teamMembers.map((member) => (
              <div
                key={member.email}
                className={`${styles.teamMember} ${teamMembers.findIndex((m) => m.email === member.email) + 1 === teamMembers.length && styles.lastTeamMember}`}
              >
                <div className={styles.memberName}>
                  <p>{member.name}</p>
                  <span>{member.email}</span>
                </div>
                <div className={styles.memberActions}>
                  <Select
                    value={member.role}
                    onChange={(e) =>
                      changeTeamInfoHandler('role', e.target.value as RoleType, member)
                    }
                    className={styles.roleSelection}
                  >
                    <option value="Org Admin">Org Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Front Desk">Front Desk</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Owner">Owner</option>
                  </Select>
                  {teamMembers.findIndex((m) => m.email === member.email) !== 0 && (
                    <Button
                      onClick={() =>
                        setTeamMembers((prev) => prev.filter((m) => m.email !== member.email))
                      }
                      variant="outline"
                      className={styles.actionDelete}
                    >
                      <Trash2 color="#ff3838" size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {openInvite && (
        <>
          <div className={styles.openInviteBackdrop}></div>
          <div className={styles.inviteMemberContainer}>
            <div className={styles.inviteMember}>
              <div className={styles.formHeader}>
                <p className={styles.formHeading}>Invite team Member</p>
                <Button
                  onClick={() => setOpenInvite(false)}
                  variant="outline"
                  className={styles.closeInviteButton}
                >
                  <X size={20} />
                </Button>
              </div>
              <div className={styles.formContent}>
                <div className={styles.fieldContainer}>
                  <Label className={styles.formLabel}>Full Name</Label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => handleNewMemberInfoChange('name', e.target.value)}
                    type="text"
                  />
                </div>
                <div className={styles.fieldContainer}>
                  <Label className={styles.formLabel}>Email</Label>
                  <Input
                    value={newMember.email}
                    onChange={(e) => handleNewMemberInfoChange('email', e.target.value)}
                    type="text"
                  />
                </div>
                <div className={styles.fieldContainer}>
                  <Label className={styles.formLabel}>Role</Label>
                  <Select
                    value={newMember.role}
                    onChange={(e) => handleNewMemberInfoChange('role', e.target.value as RoleType)}
                    className={styles.roleSelection}
                  >
                    <option value="Org Admin">Org Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Front Desk">Front Desk</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Owner">Owner</option>
                  </Select>
                </div>
                <div className={styles.inviteActions}>
                  <Button
                    onClick={() => {
                      setNewMember({ name: '', email: '', role: 'Front Desk' })
                      setOpenInvite(false)
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={newMember.name && newMember.email ? false : true}
                    variant="default"
                    onClick={handleNewMemberSubmit}
                  >
                    {isPending ? 'Sending...' : 'Send Invite'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
