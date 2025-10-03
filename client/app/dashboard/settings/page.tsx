"use client";

import React, { useState, useEffect, useId } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Select,
  SelectItem,
  Switch,
  Input,
  Divider,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Progress,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Slider,
  RadioGroup,
  Radio,
  Accordion,
  AccordionItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  Code,
} from "@heroui/react";
import {
  Settings as SettingsIcon,
  Globe,
  Palette,
  Bell,
  Shield,
  Info,
  User,
  Key,
  Clock,
  HelpCircle,
  Mail,
  Smartphone,
  Volume2,
  Eye,
  EyeOff,
  Monitor,
  Sun,
  Moon,
  Download,
  Upload,
  Database,
  Zap,
  Activity,
  FileText,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Camera,
  Edit,
  Save,
  Lock,
  MessageSquare,
  Star,
  Settings2,
  Bug,
  Github,
  Heart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { language, setLanguage, t, languages } = useI18n();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const volumeLabelId = useId();
  const cacheSizeLabelId = useId();

  // Enhanced Settings state
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    soundNotifications: true,
    notificationSound: "default",
    notificationVolume: 75,
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "08:00",

    // Security
    twoFactorAuth: false,
    autoLogout: true,
    sessionTimeout: 30,
    loginAlerts: true,
    deviceTracking: true,
    passwordExpiry: false,

    // Appearance
    compactMode: false,
    showAnimations: true,
    highContrast: false,
    fontSize: "medium",
    sidebarCollapsed: false,

    // Privacy
    analytics: true,
    crashReporting: true,
    usageData: false,
    locationTracking: false,

    // Performance
    autoSave: true,
    cacheSize: 100,
    offlineMode: false,

    // Accessibility
    screenReader: false,
    keyboardNavigation: true,
    reducedMotion: false,
  });

  // System info state
  const [systemInfo, setSystemInfo] = useState({
    platform: "Web",
    browser: "Chrome",
    version: "120.0.0",
    lastLogin: new Date().toISOString(),
    storageUsed: 45,
    cacheSize: 23,
    sessionDuration: "2h 34m",
  });

  // Activity stats
  const [activityStats, setActivityStats] = useState({
    totalLogins: 127,
    patientsViewed: 89,
    reportsGenerated: 23,
    settingsChanged: 15,
    averageSessionTime: "1h 45m",
    lastActive: new Date().toISOString(),
  });

  // Modal states
  const {
    isOpen: isExportOpen,
    onOpen: onExportOpen,
    onClose: onExportClose,
  } = useDisclosure();
  const {
    isOpen: isImportOpen,
    onOpen: onImportOpen,
    onClose: onImportClose,
  } = useDisclosure();
  const {
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose,
  } = useDisclosure();
  const {
    isOpen: isAboutOpen,
    onOpen: onAboutOpen,
    onClose: onAboutClose,
  } = useDisclosure();

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Loading states
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem("userSettings");

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);

        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }

    // Simulate system info detection
    setSystemInfo((prev) => ({
      ...prev,
      browser: navigator.userAgent.includes("Chrome")
        ? "Chrome"
        : navigator.userAgent.includes("Firefox")
          ? "Firefox"
          : navigator.userAgent.includes("Safari")
            ? "Safari"
            : "Unknown",
      platform: navigator.platform || "Unknown",
    }));
  }, []);

  const handleSettingChange = (
    key: string,
    value: boolean | number | string,
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    // Auto-save for certain settings
    if (["theme", "language", "compactMode"].includes(key)) {
      setTimeout(() => {
        handleSaveSettings(false);
      }, 500);
    }
  };

  const handleSaveSettings = async (showToast = true) => {
    setSaving(true);
    try {
      // Save to localStorage (in real app, would save to API)
      localStorage.setItem("userSettings", JSON.stringify(settings));

      if (showToast) {
        toast.success("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      if (showToast) {
        toast.error("An error occurred while saving settings.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match.");

      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");

      return;
    }

    try {
      // Here you would call API to change password
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("An error occurred while updating the password.");
    }
  };

  const handleExportSettings = async () => {
    setExporting(true);
    try {
      const exportData = {
        settings,
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
        user: user?.username,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `settings-${user?.username}-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Settings exported successfully!");
      onExportClose();
    } catch (error) {
      toast.error("An error occurred during export.");
    } finally {
      setExporting(false);
    }
  };

  const handleImportSettings = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (importData.settings) {
        setSettings((prev) => ({ ...prev, ...importData.settings }));
        await handleSaveSettings(false);
        toast.success("Settings imported successfully!");
      } else {
        throw new Error("Invalid settings file");
      }

      onImportClose();
    } catch (error) {
      toast.error("An error occurred during import.");
    } finally {
      setImporting(false);
    }
  };

  const handleResetSettings = async () => {
    try {
      const defaultSettings = {
        // Notifications
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        soundNotifications: true,
        notificationSound: "default",
        notificationVolume: 75,
        quietHours: false,
        quietStart: "22:00",
        quietEnd: "08:00",

        // Security
        twoFactorAuth: false,
        autoLogout: true,
        sessionTimeout: 30,
        loginAlerts: true,
        deviceTracking: true,
        passwordExpiry: false,

        // Appearance
        compactMode: false,
        showAnimations: true,
        highContrast: false,
        fontSize: "medium",
        sidebarCollapsed: false,

        // Privacy
        analytics: true,
        crashReporting: true,
        usageData: false,
        locationTracking: false,

        // Performance
        autoSave: true,
        cacheSize: 100,
        offlineMode: false,

        // Accessibility
        screenReader: false,
        keyboardNavigation: true,
        reducedMotion: false,
      };

      setSettings(defaultSettings);
      localStorage.removeItem("userSettings");
      toast.success("Settings were reset to default values!");
      onResetClose();
    } catch (error) {
      toast.error("An error occurred while resetting settings.");
    }
  };

  const handleClearCache = async () => {
    try {
      // Clear various caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();

        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // Clear localStorage except for essential data
      const essentialKeys = ["userSettings", "authToken"];
      const allKeys = Object.keys(localStorage);

      allKeys.forEach((key) => {
        if (!essentialKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      toast.success("Cache cleared successfully!");

      // Update system info
      setSystemInfo((prev) => ({ ...prev, cacheSize: 0 }));
    } catch (error) {
      toast.error("An error occurred while clearing the cache.");
    }
  };

  const getUserRole = () => {
    if (!user) return t("user.guest");
    switch (user.permLevel) {
      case 3:
        return "System Administrator";
      case 2:
        return "Doctor";
      case 1:
        return "Nurse";
      default:
        return "User";
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;

    return Math.min(100, strength);
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 40) return "danger";
    if (strength < 70) return "warning";

    return "success";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 40) return "Weak";
    if (strength < 70) return "Moderate";

    return "Strong";
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-lg">
            <SettingsIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Personalization and security options
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button startContent={<Settings2 size={16} />} variant="flat">
                Quick Actions
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Quick actions">
              <DropdownItem
                key="export"
                startContent={<Download size={16} />}
                onPress={onExportOpen}
              >
                Export Settings
              </DropdownItem>
              <DropdownItem
                key="import"
                startContent={<Upload size={16} />}
                onPress={onImportOpen}
              >
                Import Settings
              </DropdownItem>
              <DropdownItem
                key="cache"
                startContent={<Trash2 size={16} />}
                onPress={handleClearCache}
              >
                Clear Cache
              </DropdownItem>
              <DropdownItem
                key="reset"
                color="danger"
                startContent={<RefreshCw size={16} />}
                onPress={onResetOpen}
              >
                Factory Reset
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Button
            color="primary"
            isLoading={saving}
            startContent={<Save size={16} />}
            onPress={() => handleSaveSettings(true)}
          >
            Save
          </Button>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-success">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  System Status
                </p>
                <p className="text-xl font-semibold text-success">Online</p>
              </div>
              <CheckCircle className="text-success" size={24} />
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Session Duration
                </p>
                <p className="text-xl font-semibold">
                  {systemInfo.sessionDuration}
                </p>
              </div>
              <Clock className="text-primary" size={24} />
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Depolama
                </p>
                <p className="text-xl font-semibold">
                  {systemInfo.storageUsed}%
                </p>
              </div>
              <Database className="text-warning" size={24} />
            </div>
            <Progress
              className="mt-2"
              color="warning"
              size="sm"
              value={systemInfo.storageUsed}
            />
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cache
                </p>
                <p className="text-xl font-semibold">
                  {systemInfo.cacheSize} MB
                </p>
              </div>
              <Zap className="text-secondary" size={24} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs aria-label="Settings tabs" className="w-full" variant="underlined">
        {/* Profile & General */}
        <Tab
          key="profile"
          title={
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profil</span>
            </div>
          }
        >
          <div className="space-y-6 mt-6">
            {/* Enhanced User Profile */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar
                        className="ring-4 ring-white/20 shadow-lg"
                        name={user?.username}
                        size="lg"
                      />
                      <Button
                        isIconOnly
                        className="absolute -bottom-1 -right-1"
                        color="primary"
                        size="sm"
                      >
                        <Camera size={12} />
                      </Button>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {user?.username}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Chip color="primary" size="sm" variant="solid">
                          {getUserRole()}
                        </Chip>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Last login:{" "}
                        {new Date(systemInfo.lastLogin).toLocaleDateString(
                          "en-US",
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    startContent={<Edit size={14} />}
                    variant="flat"
                  >
                    Edit
                  </Button>
                </div>
              </div>

              <CardBody className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full">
                      <Activity className="text-primary" size={20} />
                    </div>
                    <p className="text-2xl font-bold">
                      {activityStats.totalLogins}
                    </p>
                    <p className="text-sm text-gray-500">Total Logins</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-success/10 rounded-full">
                      <Users className="text-success" size={20} />
                    </div>
                    <p className="text-2xl font-bold">
                      {activityStats.patientsViewed}
                    </p>
                    <p className="text-sm text-gray-500">Patients Viewed</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-warning/10 rounded-full">
                      <TrendingUp className="text-warning" size={20} />
                    </div>
                    <p className="text-2xl font-bold">
                      {activityStats.reportsGenerated}
                    </p>
                    <p className="text-sm text-gray-500">Reports Generated</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Language & Region */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Language & Region</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Interface Language"
                    selectedKeys={[language]}
                    onSelectionChange={(keys) => {
                      const selectedLang = Array.from(keys)[0] as string;

                      setLanguage(selectedLang as "en" | "tr");
                    }}
                  >
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} textValue={lang.name}>
                        <div className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    defaultSelectedKeys={["Europe/Istanbul"]}
                    label="Time Zone"
                  >
                    <SelectItem key="Europe/Istanbul">
                      Istanbul (GMT+3)
                    </SelectItem>
                    <SelectItem key="Europe/London">London (GMT+0)</SelectItem>
                    <SelectItem key="America/New_York">
                      New York (GMT-5)
                    </SelectItem>
                  </Select>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* Appearance & Customization */}
        <Tab
          key="appearance"
          title={
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </div>
          }
        >
          <div className="space-y-6 mt-6">
            {/* Theme Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Theme Selection</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                <RadioGroup
                  className="gap-4"
                  orientation="horizontal"
                  value={theme || "system"}
                  onValueChange={(value) => setTheme(value)}
                >
                  <Radio
                    classNames={{
                      base: "flex-1 m-0 bg-content1 hover:bg-content2 cursor-pointer rounded-lg border-2 border-default-200 data-[selected=true]:border-primary",
                      wrapper: "hidden",
                      labelWrapper: "flex flex-col items-center p-4",
                    }}
                    description="Bright, high-contrast theme"
                    value="light"
                  >
                    <Sun className="mb-2" size={24} />
                    <span className="font-medium">Light</span>
                  </Radio>
                  <Radio
                    classNames={{
                      base: "flex-1 m-0 bg-content1 hover:bg-content2 cursor-pointer rounded-lg border-2 border-default-200 data-[selected=true]:border-primary",
                      wrapper: "hidden",
                      labelWrapper: "flex flex-col items-center p-4",
                    }}
                    description="Low-light optimized theme"
                    value="dark"
                  >
                    <Moon className="mb-2" size={24} />
                    <span className="font-medium">Dark</span>
                  </Radio>
                  <Radio
                    classNames={{
                      base: "flex-1 m-0 bg-content1 hover:bg-content2 cursor-pointer rounded-lg border-2 border-default-200 data-[selected=true]:border-primary",
                      wrapper: "hidden",
                      labelWrapper: "flex flex-col items-center p-4",
                    }}
                    description="Match system preference"
                    value="system"
                  >
                    <Monitor className="mb-2" size={24} />
                    <span className="font-medium">System</span>
                  </Radio>
                </RadioGroup>
              </CardBody>
            </Card>

            {/* Display Settings */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Display Settings</h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compact Mode</p>
                      <p className="text-sm text-gray-500">
                        Less spacing for more content
                      </p>
                    </div>
                    <Switch
                      isSelected={settings.compactMode}
                      onValueChange={(value) =>
                        handleSettingChange("compactMode", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Animations</p>
                      <p className="text-sm text-gray-500">
                        Enable transition effects and animations
                      </p>
                    </div>
                    <Switch
                      isSelected={settings.showAnimations}
                      onValueChange={(value) =>
                        handleSettingChange("showAnimations", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">High Contrast</p>
                      <p className="text-sm text-gray-500">
                        Use more pronounced colors for accessibility
                      </p>
                    </div>
                    <Switch
                      isSelected={settings.highContrast}
                      onValueChange={(value) =>
                        handleSettingChange("highContrast", value)
                      }
                    />
                  </div>
                </div>

                <Divider />

                <div className="space-y-4">
                  <Select
                    className="max-w-xs"
                    label="Font Size"
                    labelPlacement="outside"
                    selectedKeys={[settings.fontSize]}
                    onSelectionChange={(keys) => {
                      const size = Array.from(keys)[0] as string;

                      handleSettingChange("fontSize", size);
                    }}
                  >
                    <SelectItem key="small">Small</SelectItem>
                    <SelectItem key="medium">Medium</SelectItem>
                    <SelectItem key="large">Large</SelectItem>
                    <SelectItem key="xl">Extra Large</SelectItem>
                  </Select>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* Notifications */}
        <Tab
          key="notifications"
          title={
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
              <Badge color="danger" content="3" size="sm">
                <span />
              </Badge>
            </div>
          }
        >
          <div className="space-y-6 mt-6">
            {/* Notification Types */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">
                      Notification Types
                    </h3>
                  </div>
                  <Chip color="primary" size="sm" variant="flat">
                    {Object.values(settings).filter(Boolean).length} active
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <Accordion>
                  <AccordionItem
                    key="email"
                    title={
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <span>Email Notifications</span>
                        </div>
                        <Switch
                          isSelected={settings.emailNotifications}
                          size="sm"
                          onValueChange={(value) =>
                            handleSettingChange("emailNotifications", value)
                          }
                        />
                      </div>
                    }
                  >
                    <div className="pl-8 space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Important updates and system notices are sent by email.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Patient appointments</span>
                        <Switch defaultSelected size="sm" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System updates</span>
                        <Switch defaultSelected size="sm" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Security alerts</span>
                        <Switch defaultSelected size="sm" />
                      </div>
                    </div>
                  </AccordionItem>

                  <AccordionItem
                    key="push"
                    title={
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-gray-500" />
                          <span>Push Notifications</span>
                        </div>
                        <Switch
                          isSelected={settings.pushNotifications}
                          size="sm"
                          onValueChange={(value) =>
                            handleSettingChange("pushNotifications", value)
                          }
                        />
                      </div>
                    }
                  >
                    <div className="pl-8 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Emergency alerts</span>
                        <Switch defaultSelected size="sm" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Appointment reminders</span>
                        <Switch defaultSelected size="sm" />
                      </div>
                    </div>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>

            {/* Sound & Volume */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Sound Settings</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Sound Notifications</span>
                  <Switch
                    isSelected={settings.soundNotifications}
                    onValueChange={(value) =>
                      handleSettingChange("soundNotifications", value)
                    }
                  />
                </div>

                {settings.soundNotifications && (
                  <>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`${volumeLabelId}-slider`}
                        id={volumeLabelId}
                      >
                        Volume
                      </label>
                      <Slider
                        aria-labelledby={volumeLabelId}
                        className="max-w-md"
                        color="primary"
                        id={`${volumeLabelId}-slider`}
                        maxValue={100}
                        step={5}
                        value={[settings.notificationVolume]}
                        onChange={(value: number | number[]) => {
                          const vol = Array.isArray(value) ? value[0] : value;

                          handleSettingChange("notificationVolume", vol);
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Mute</span>
                        <span>{settings.notificationVolume}%</span>
                        <span>High</span>
                      </div>
                    </div>

                    <Select
                      className="max-w-xs"
                      label="Notification Sound"
                      selectedKeys={[settings.notificationSound]}
                      onSelectionChange={(keys) => {
                        const sound = Array.from(keys)[0] as string;

                        handleSettingChange("notificationSound", sound);
                      }}
                    >
                      <SelectItem key="default">Default</SelectItem>
                      <SelectItem key="chime">Chime</SelectItem>
                      <SelectItem key="alert">Alert</SelectItem>
                      <SelectItem key="notification">Notification</SelectItem>
                    </Select>
                  </>
                )}
              </CardBody>
            </Card>

            {/* Quiet Hours */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Moon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Quiet Hours</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Quiet Hours</p>
                    <p className="text-sm text-gray-500">
                      Silence notifications during the selected hours
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.quietHours}
                    onValueChange={(value) =>
                      handleSettingChange("quietHours", value)
                    }
                  />
                </div>

                {settings.quietHours && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Start"
                      type="time"
                      value={settings.quietStart}
                      onChange={(e) =>
                        handleSettingChange("quietStart", e.target.value)
                      }
                    />
                    <Input
                      label="End"
                      type="time"
                      value={settings.quietEnd}
                      onChange={(e) =>
                        handleSettingChange("quietEnd", e.target.value)
                      }
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* Security & Privacy */}
        <Tab
          key="security"
          title={
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </div>
          }
        >
          <div className="space-y-6 mt-6">
            {/* Password Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Key className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Password Settings</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  label="Current Password"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                />

                <div className="space-y-2">
                  <Input
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                    label="New Password"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />

                  {passwordData.newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Password Strength:</span>
                        <span
                          className={`font-medium text-${getPasswordStrengthColor(getPasswordStrength(passwordData.newPassword))}`}
                        >
                          {getPasswordStrengthText(
                            getPasswordStrength(passwordData.newPassword),
                          )}
                        </span>
                      </div>
                      <Progress
                        color={
                          getPasswordStrengthColor(
                            getPasswordStrength(passwordData.newPassword),
                          ) as any
                        }
                        size="sm"
                        value={getPasswordStrength(passwordData.newPassword)}
                      />
                    </div>
                  )}
                </div>

                <Input
                  color={
                    passwordData.confirmPassword &&
                    passwordData.newPassword !== passwordData.confirmPassword
                      ? "danger"
                      : "default"
                  }
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  errorMessage={
                    passwordData.confirmPassword &&
                    passwordData.newPassword !== passwordData.confirmPassword
                      ? "Passwords do not match"
                      : ""
                  }
                  label="Confirm Password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />

                <Button
                  className="w-full"
                  color="primary"
                  isDisabled={
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                  onPress={handlePasswordChange}
                >
                  Change Password
                </Button>
              </CardBody>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Two-Factor Authentication
                  </h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-gray-500">
                      Increase the security of your account
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.twoFactorAuth}
                    onValueChange={(value) =>
                      handleSettingChange("twoFactorAuth", value)
                    }
                  />
                </div>

                {settings.twoFactorAuth && (
                  <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle
                        className="text-warning mt-0.5"
                        size={20}
                      />
                      <div>
                        <p className="font-medium text-warning">2FA Active</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Scan the QR code using Google Authenticator or a
                          similar app.
                        </p>
                        <Button
                          className="mt-2"
                          color="warning"
                          size="sm"
                          variant="flat"
                        >
                          Show QR Code
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Session & Access */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Session & Access</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Automatic Logout</p>
                    <p className="text-sm text-gray-500">
                      Sign out after periods of inactivity
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.autoLogout}
                    onValueChange={(value) =>
                      handleSettingChange("autoLogout", value)
                    }
                  />
                </div>

                {settings.autoLogout && (
                  <div className="pl-4">
                    <Input
                      className="max-w-xs"
                      endContent={
                        <span className="text-sm text-gray-500">min</span>
                      }
                      label="Timeout (minutes)"
                      max={480}
                      min={5}
                      type="number"
                      value={settings.sessionTimeout.toString()}
                      onChange={(e) =>
                        handleSettingChange(
                          "sessionTimeout",
                          parseInt(e.target.value) || 30,
                        )
                      }
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Alerts</p>
                    <p className="text-sm text-gray-500">
                      Notify when new devices sign in
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.loginAlerts}
                    onValueChange={(value) =>
                      handleSettingChange("loginAlerts", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Device Tracking</p>
                    <p className="text-sm text-gray-500">
                      Monitor active sessions
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.deviceTracking}
                    onValueChange={(value) =>
                      handleSettingChange("deviceTracking", value)
                    }
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* System & Performance */}
        <Tab
          key="system"
          title={
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>System</span>
            </div>
          }
        >
          <div className="space-y-6 mt-6">
            {/* System Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">System Information</h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Platform</p>
                    <p className="font-medium">{systemInfo.platform}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Browser</p>
                    <p className="font-medium">{systemInfo.browser}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Version</p>
                    <p className="font-medium">v2.1.0</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">February 15, 2024</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Uptime</p>
                    <p className="font-medium">{systemInfo.sessionDuration}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Memory Usage</p>
                    <p className="font-medium">127 MB</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Performance Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Performance Settings
                  </h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Save</p>
                    <p className="text-sm text-gray-500">
                      Automatically store changes
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.autoSave}
                    onValueChange={(value) =>
                      handleSettingChange("autoSave", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Offline Mode</p>
                    <p className="text-sm text-gray-500">
                      Work without an internet connection
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.offlineMode}
                    onValueChange={(value) =>
                      handleSettingChange("offlineMode", value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor={`${cacheSizeLabelId}-slider`}
                    id={cacheSizeLabelId}
                  >
                    Cache Size (MB)
                  </label>
                  <Slider
                    aria-labelledby={cacheSizeLabelId}
                    className="max-w-md"
                    color="primary"
                    id={`${cacheSizeLabelId}-slider`}
                    maxValue={500}
                    minValue={50}
                    step={25}
                    value={[settings.cacheSize]}
                    onChange={(value: number | number[]) => {
                      const size = Array.isArray(value) ? value[0] : value;

                      handleSettingChange("cacheSize", size);
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>50 MB</span>
                    <span>{settings.cacheSize} MB</span>
                    <span>500 MB</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    startContent={<Trash2 size={16} />}
                    variant="flat"
                    onPress={handleClearCache}
                  >
                    Clear Cache
                  </Button>
                  <Button
                    color="warning"
                    startContent={<RefreshCw size={16} />}
                    variant="flat"
                  >
                    Refresh Page
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Privacy</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics</p>
                    <p className="text-sm text-gray-500">
                      Share usage statistics
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.analytics}
                    onValueChange={(value) =>
                      handleSettingChange("analytics", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Crash Reports</p>
                    <p className="text-sm text-gray-500">
                      Automatically send error reports
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.crashReporting}
                    onValueChange={(value) =>
                      handleSettingChange("crashReporting", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Usage Data</p>
                    <p className="text-sm text-gray-500">
                      Track feature adoption
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.usageData}
                    onValueChange={(value) =>
                      handleSettingChange("usageData", value)
                    }
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* About & Support */}
        <Tab
          key="about"
          title={
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span>About</span>
            </div>
          }
        >
          <div className="space-y-6 mt-6">
            {/* App Information */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full">
                    <Heart className="text-primary" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Hospital Management System
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Hospital Management System v2.1.0
                  </p>
                </div>
              </div>

              <CardBody className="p-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    A modern, user-friendly, and secure platform designed for
                    hospital operations.
                  </p>

                  <div className="flex items-center justify-center space-x-6">
                    <Tooltip content="GitHub">
                      <Button isIconOnly size="sm" variant="flat">
                        <Github size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Documentation">
                      <Button isIconOnly size="sm" variant="flat">
                        <FileText size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Support">
                      <Button isIconOnly size="sm" variant="flat">
                        <MessageSquare size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Rate Us">
                      <Button isIconOnly size="sm" variant="flat">
                        <Star size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Version Information */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Version Information</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Application Version</p>
                    <Code size="sm">v2.1.0</Code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Build Number</p>
                    <Code size="sm">2024.02.15.001</Code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">API Version</p>
                    <Code size="sm">v1.0.0</Code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Last Update</p>
                    <Code size="sm">February 15, 2024</Code>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Support & Feedback */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Support & Feedback</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    startContent={<HelpCircle size={16} />}
                    variant="flat"
                    onPress={onAboutOpen}
                  >
                    Help Center
                  </Button>
                  <Button startContent={<Mail size={16} />} variant="flat">
                    Contact
                  </Button>
                  <Button startContent={<Bug size={16} />} variant="flat">
                    Report Issue
                  </Button>
                  <Button startContent={<Star size={16} />} variant="flat">
                    Rate Us
                  </Button>
                </div>

                <Divider />

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    © 2025 Hospital Management System. All rights reserved.
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <Button size="sm" variant="light">
                      Privacy Policy
                    </Button>
                    <Button size="sm" variant="light">
                      Terms of Use
                    </Button>
                    <Button size="sm" variant="light">
                      Licenses
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>

      {/* Modals */}
      {/* Export Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose}>
        <ModalContent>
          <ModalHeader>Export Settings</ModalHeader>
          <ModalBody>
            <p>
              All of your personal settings will be saved as a JSON file. You
              can import this file on another device.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onExportClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={exporting}
              onPress={handleExportSettings}
            >
              Export
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={isImportOpen} onClose={onImportClose}>
        <ModalContent>
          <ModalHeader>Import Settings</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p>
                Select the settings file you previously exported. Your existing
                preferences will be overwritten.
              </p>
              <Input
                accept=".json"
                label="Choose Settings File"
                type="file"
                onChange={handleImportSettings}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onImportClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Reset Modal */}
      <Modal isOpen={isResetOpen} onClose={onResetClose}>
        <ModalContent>
          <ModalHeader>Reset to Factory Defaults</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-warning mt-1" size={20} />
                <div>
                  <p className="font-medium">This action cannot be undone!</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All custom settings will be restored to their default
                    values. Your profile information and data will remain
                    intact.
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onResetClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleResetSettings}>
              Reset
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* About Modal */}
      <Modal isOpen={isAboutOpen} size="2xl" onClose={onAboutClose}>
        <ModalContent>
          <ModalHeader>Help Center</ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">
                  Frequently Asked Questions
                </h4>
                <Accordion>
                  <AccordionItem key="1" title="How can I change my password?">
                    Enter your current password on the Security tab and set a
                    new one.
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    title="How can I customize notifications?"
                  >
                    Choose the notifications you want to receive from the
                    Notifications tab.
                  </AccordionItem>
                  <AccordionItem key="3" title="How can I change the theme?">
                    Select light, dark, or system theme from the Appearance tab.
                  </AccordionItem>
                </Accordion>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Keyboard Shortcuts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Save settings</span>
                    <Code size="sm">Ctrl + S</Code>
                  </div>
                  <div className="flex justify-between">
                    <span>Search</span>
                    <Code size="sm">Ctrl + K</Code>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle theme</span>
                    <Code size="sm">Ctrl + Shift + T</Code>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onAboutClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
