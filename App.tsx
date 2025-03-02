import React, { useState, useRef, useEffect } from 'react';
import { FileUp, Link, Star, ShoppingBag, ArrowRight, Download, LogOut, LogIn } from 'lucide-react';

// Types for Discord user
interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');
  const [user, setUser] = useState<DiscordUser | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Discord OAuth2 configuration
  const DISCORD_CLIENT_ID = '1345779547013906452'; // Updated Discord client ID
  const REDIRECT_URI = window.location.origin;
  const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;

  // Check for Discord authentication on component mount
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');
    
    if (accessToken) {
      // Remove the hash from the URL
      window.history.pushState({}, '', window.location.pathname);
      
      // Fetch user data from Discord
      fetchDiscordUser(accessToken);
    }
    
    // Check if user data is in localStorage
    const storedUser = localStorage.getItem('discord_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('discord_user');
      }
    }
  }, []);

  // Fetch Discord user data
  const fetchDiscordUser = async (accessToken: string) => {
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('discord_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching Discord user:', error);
    }
  };

  const handleLogin = () => {
    window.location.href = DISCORD_OAUTH_URL;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('discord_user');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLink.trim()) {
      setLinks(prev => [...prev, newLink]);
      setNewLink('');
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  // Sample data for downloads section
  const sampleDownloads = [
    { name: 'software_v1.2.zip', size: '24.5 MB', downloads: 128 },
    { name: 'utility_pack.zip', size: '8.7 MB', downloads: 76 },
    { name: 'premium_tools.zip', size: '42.1 MB', downloads: 203 },
    { name: 'resources.zip', size: '15.3 MB', downloads: 94 },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-gray-800">
        <div className="text-xl font-bold">MS Solution</div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-red-500 transition-colors">Products</a>
          <a href="#" className="hover:text-red-500 transition-colors">Reviews</a>
          <a href="#" className="hover:text-red-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-red-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-red-500 transition-colors">About</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <Star size={20} />
          </button>
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-md">
                <img 
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
                  alt="Avatar"
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                  }}
                />
                <span className="text-sm">{user.username}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 p-2 rounded-md transition-colors"
            >
              <LogIn size={18} />
              <span>Discord Login</span>
            </button>
          )}
          <button className="bg-red-600 p-2 rounded-md flex items-center">
            <ShoppingBag size={20} />
            <span className="ml-1">0</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-2">MS Solution</h1>
          <p className="text-gray-400 mb-8">Discord.gg/sln</p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <div className="bg-gray-900 px-4 py-2 rounded-md flex items-center">
              <ShoppingBag size={18} className="text-red-500 mr-2" />
              <span>18 products sold</span>
            </div>
            <div className="bg-gray-900 px-4 py-2 rounded-md flex items-center">
              <Star size={18} className="text-yellow-500 mr-2" />
              <span>5/5 rated (2 reviews)</span>
            </div>
          </div>
          
          <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md inline-flex items-center transition-colors">
            <span>View products</span>
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex border-b border-gray-800">
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'upload' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload Files & Links
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'download' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('download')}
            >
              Download Files
            </button>
          </div>
        </div>

        {activeTab === 'upload' ? (
          /* File and Link Upload Section */
          <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg p-6 mb-12">
            <h2 className="text-2xl font-bold mb-6">Upload Files & Links</h2>
            
            {!user ? (
              <div className="bg-gray-800 p-6 rounded-lg text-center mb-6">
                <p className="mb-4">You need to log in with Discord to upload files and links.</p>
                <button 
                  onClick={handleLogin}
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-md inline-flex items-center transition-colors"
                >
                  <LogIn size={18} className="mr-2" />
                  <span>Login with Discord</span>
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* File Upload */}
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <FileUp className="mr-2" /> Upload Files
                  </h3>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept=".zip,.rar,.7z,.tar,.gz"
                  />
                  <button
                    onClick={handleFileUploadClick}
                    className="w-full bg-red-600 hover:bg-red-700 py-3 px-4 rounded-md mb-4 transition-colors"
                  >
                    Select Files
                  </button>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Uploaded Files ({files.length})</h4>
                    {files.length > 0 ? (
                      <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {files.map((file, index) => (
                          <li key={index} className="bg-gray-700 p-2 rounded flex justify-between items-center">
                            <span className="truncate">{file.name}</span>
                            <button 
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-400"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm">No files uploaded yet</p>
                    )}
                  </div>
                </div>
                
                {/* Link Upload */}
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Link className="mr-2" /> Add Links
                  </h3>
                  <form onSubmit={handleAddLink} className="mb-4">
                    <input
                      type="url"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mb-3 text-white"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 py-3 px-4 rounded-md transition-colors"
                    >
                      Add Link
                    </button>
                  </form>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Saved Links ({links.length})</h4>
                    {links.length > 0 ? (
                      <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {links.map((link, index) => (
                          <li key={index} className="bg-gray-700 p-2 rounded flex justify-between items-center">
                            <a 
                              href={link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-400 hover:text-blue-300 truncate"
                            >
                              {link}
                            </a>
                            <button 
                              onClick={() => removeLink(index)}
                              className="text-red-500 hover:text-red-400 ml-2"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm">No links added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Download Section */
          <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg p-6 mb-12">
            <h2 className="text-2xl font-bold mb-6">Download Files</h2>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Download className="mr-2" /> Available Files
              </h3>
              
              <div className="mt-4">
                <ul className="space-y-3">
                  {sampleDownloads.map((file, index) => (
                    <li key={index} className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{file.name}</h4>
                          <div className="flex space-x-4 text-sm text-gray-400 mt-1">
                            <span>{file.size}</span>
                            <span>{file.downloads} downloads</span>
                          </div>
                        </div>
                        <button className="bg-red-600 hover:bg-red-700 p-2 rounded-md transition-colors">
                          <Download size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Video Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Video</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe 
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Featured Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MS Solution</h3>
              <p className="text-gray-400">Providing high-quality file hosting and sharing services since 2023.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-500 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Products</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Reviews</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
              <p className="text-gray-400 mb-2">Discord: Discord.gg/sln</p>
              <p className="text-gray-400">Email: contact@mssolution.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
            <p>© 2025 MS Solution. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;