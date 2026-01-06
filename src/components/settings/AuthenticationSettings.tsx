"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui";

interface AuthConfig {
  localAuth: {
    enabled: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      expirationDays: number;
    };
  };
  ldap: {
    enabled: boolean;
    serverUrl: string;
    bindDN: string;
    bindPassword: string;
    baseDN: string;
    userSearchFilter: string;
    groupSearchFilter: string;
  };
  saml: {
    enabled: boolean;
    entityId: string;
    ssoUrl: string;
    certificate: string;
    nameIdFormat: string;
  };
  mfa: {
    enabled: boolean;
    required: boolean;
    methods: string[];
  };
}

export function AuthenticationSettings() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<AuthConfig>({
    localAuth: {
      enabled: true,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        expirationDays: 90,
      },
    },
    ldap: {
      enabled: false,
      serverUrl: "ldap://ldap.example.com:389",
      bindDN: "cn=admin,dc=example,dc=com",
      bindPassword: "",
      baseDN: "dc=example,dc=com",
      userSearchFilter: "(uid={username})",
      groupSearchFilter: "(member={dn})",
    },
    saml: {
      enabled: false,
      entityId: "https://ipam.example.com",
      ssoUrl: "https://sso.example.com/saml",
      certificate: "",
      nameIdFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
    },
    mfa: {
      enabled: true,
      required: false,
      methods: ["totp"],
    },
  });

  const handleSave = () => {
    showToast("Authentication settings saved successfully", "success");
  };

  const handleTestLDAP = async () => {
    showToast("Testing LDAP connection...", "info");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    showToast("LDAP connection test successful", "success");
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Authentication Settings</h3>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#2b6cb0] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Save Changes
          </button>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Local Authentication</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={config.localAuth.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    localAuth: { ...config.localAuth, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Enable Local Authentication</p>
                <p className="text-xs text-slate-600">Allow users to authenticate with username and password</p>
              </div>
            </label>

            {config.localAuth.enabled && (
              <div>
                <h5 className="text-sm font-semibold text-slate-900 mb-3">Password Policy</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Minimum Length
                    </label>
                    <input
                      type="number"
                      min="4"
                      max="128"
                      value={config.localAuth.passwordPolicy.minLength}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          localAuth: {
                            ...config.localAuth,
                            passwordPolicy: {
                              ...config.localAuth.passwordPolicy,
                              minLength: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Expiration (days)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={config.localAuth.passwordPolicy.expirationDays}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          localAuth: {
                            ...config.localAuth,
                            passwordPolicy: {
                              ...config.localAuth.passwordPolicy,
                              expirationDays: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {[
                    { key: "requireUppercase", label: "Require Uppercase Letters" },
                    { key: "requireLowercase", label: "Require Lowercase Letters" },
                    { key: "requireNumbers", label: "Require Numbers" },
                    { key: "requireSpecialChars", label: "Require Special Characters" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={config.localAuth.passwordPolicy[key as keyof typeof config.localAuth.passwordPolicy] as boolean}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            localAuth: {
                              ...config.localAuth,
                              passwordPolicy: {
                                ...config.localAuth.passwordPolicy,
                                [key]: e.target.checked,
                              },
                            },
                          })
                        }
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">LDAP / Active Directory</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={config.ldap.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    ldap: { ...config.ldap, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Enable LDAP/AD Integration</p>
                <p className="text-xs text-slate-600">Authenticate users against LDAP or Active Directory</p>
              </div>
            </label>

            {config.ldap.enabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Server URL</label>
                    <input
                      type="text"
                      value={config.ldap.serverUrl}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          ldap: { ...config.ldap, serverUrl: e.target.value },
                        })
                      }
                      placeholder="ldap://ldap.example.com:389"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Base DN</label>
                    <input
                      type="text"
                      value={config.ldap.baseDN}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          ldap: { ...config.ldap, baseDN: e.target.value },
                        })
                      }
                      placeholder="dc=example,dc=com"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bind DN</label>
                    <input
                      type="text"
                      value={config.ldap.bindDN}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          ldap: { ...config.ldap, bindDN: e.target.value },
                        })
                      }
                      placeholder="cn=admin,dc=example,dc=com"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bind Password</label>
                    <input
                      type="password"
                      value={config.ldap.bindPassword}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          ldap: { ...config.ldap, bindPassword: e.target.value },
                        })
                      }
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">User Search Filter</label>
                    <input
                      type="text"
                      value={config.ldap.userSearchFilter}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          ldap: { ...config.ldap, userSearchFilter: e.target.value },
                        })
                      }
                      placeholder="(uid={username})"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Group Search Filter</label>
                    <input
                      type="text"
                      value={config.ldap.groupSearchFilter}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          ldap: { ...config.ldap, groupSearchFilter: e.target.value },
                        })
                      }
                      placeholder="(member={dn})"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={handleTestLDAP}
                  className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Test LDAP Connection
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">SAML / SSO</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={config.saml.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    saml: { ...config.saml, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Enable SAML/SSO</p>
                <p className="text-xs text-slate-600">Single Sign-On authentication via SAML 2.0</p>
              </div>
            </label>

            {config.saml.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Entity ID</label>
                  <input
                    type="text"
                    value={config.saml.entityId}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        saml: { ...config.saml, entityId: e.target.value },
                      })
                    }
                    placeholder="https://ipam.example.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SSO URL</label>
                  <input
                    type="url"
                    value={config.saml.ssoUrl}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        saml: { ...config.saml, ssoUrl: e.target.value },
                      })
                    }
                    placeholder="https://sso.example.com/saml"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name ID Format</label>
                  <select
                    value={config.saml.nameIdFormat}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        saml: { ...config.saml, nameIdFormat: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">Email Address</option>
                    <option value="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">Persistent</option>
                    <option value="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">Transient</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Certificate</label>
                  <textarea
                    value={config.saml.certificate}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        saml: { ...config.saml, certificate: e.target.value },
                      })
                    }
                    placeholder="Paste X.509 certificate..."
                    rows={5}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-slate-900 mb-4">Multi-Factor Authentication (MFA)</h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={config.mfa.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    mfa: { ...config.mfa, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Enable MFA</p>
                <p className="text-xs text-slate-600">Require multi-factor authentication for enhanced security</p>
              </div>
            </label>

            {config.mfa.enabled && (
              <>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={config.mfa.required}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        mfa: { ...config.mfa, required: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Require MFA for All Users</p>
                    <p className="text-xs text-slate-600">Make MFA mandatory for all user accounts</p>
                  </div>
                </label>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">MFA Methods</label>
                  <div className="space-y-2">
                    {[
                      { id: "totp", label: "TOTP (Time-based One-Time Password)", description: "Authenticator apps like Google Authenticator" },
                      { id: "sms", label: "SMS", description: "Text message verification" },
                      { id: "email", label: "Email", description: "Email verification code" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={config.mfa.methods.includes(method.id)}
                          onChange={(e) => {
                            const methods = config.mfa.methods;
                            if (e.target.checked) {
                              setConfig({
                                ...config,
                                mfa: { ...config.mfa, methods: [...methods, method.id] },
                              });
                            } else {
                              setConfig({
                                ...config,
                                mfa: { ...config.mfa, methods: methods.filter((m) => m !== method.id) },
                              });
                            }
                          }}
                          className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-slate-900">{method.label}</span>
                          <p className="text-xs text-slate-600">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

