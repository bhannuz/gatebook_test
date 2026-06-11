# 📥 HOW TO DOWNLOAD FILES ON MACBOOK

## ⚠️ IMPORTANT: Understanding the File Location

The path `/mnt/user-data/outputs/` is on a **Linux server** (not your Mac).

You need to either:
1. **Access it via Terminal/Command Line** (if you have SSH access)
2. **Use a GUI tool** (File Transfer Apps)
3. **Download from a web interface** (if available)

---

## ✅ METHOD 1: Using Terminal (EASIEST - if you have server access)

### Step 1: Open Terminal on Mac
```
Press: Command + Space
Type: Terminal
Press: Enter
```

### Step 2: Connect to Server via SCP (Secure Copy)

Replace `your-username` and `server-address` with your actual details:

```bash
scp -r your-username@server-address:/mnt/user-data/outputs/gatebook_hybrid ~/Downloads/

scp your-username@server-address:/mnt/user-data/outputs/START_HERE.md ~/Downloads/
scp your-username@server-address:/mnt/user-data/outputs/REFACTORING_SUMMARY.md ~/Downloads/
scp your-username@server-address:/mnt/user-data/outputs/EXTRACTION_GUIDE.md ~/Downloads/
scp your-username@server-address:/mnt/user-data/outputs/app.html ~/Downloads/
```

**What this does:**
- Downloads files to your Mac's Downloads folder
- `-r` flag copies entire folders recursively
- `server-address` = your server's IP or domain

### Step 3: Check Downloads Folder
Files will appear in: **~/Downloads/** or **Finder > Downloads**

---

## ✅ METHOD 2: Using Finder with SSH (GUI Method)

### Step 1: Open Finder
```
Click: Finder (in Dock or Applications)
```

### Step 2: Connect to Server
```
Press: Command + K (or Go > Connect to Server)
```

### Step 3: Enter Server Address
```
sftp://your-username@server-address/mnt/user-data/outputs/
```

### Step 4: Download Files
```
1. Drag files to Downloads
OR
2. Right-click > Copy
3. Open Downloads folder
4. Paste files
```

---

## ✅ METHOD 3: Using FileZilla (Easiest GUI - Free)

### Step 1: Download FileZilla
```
Go to: https://filezilla-project.org/
Download: FileZilla Client (Mac version)
```

### Step 2: Install FileZilla
```
Open the .dmg file
Drag FileZilla to Applications
```

### Step 3: Open FileZilla
```
Click: Applications > FileZilla
```

### Step 4: Connect to Server
```
File > Site Manager > New Site

Fill in:
  Protocol: SFTP - SSH File Transfer Protocol
  Host: your-server-address
  Port: 22
  Logon Type: Normal
  User: your-username
  Password: your-password

Click: Connect
```

### Step 5: Navigate and Download
```
Left panel: Your Mac
Right panel: Server files

1. On right side, navigate to: /mnt/user-data/outputs/
2. Right-click on gatebook_hybrid folder
3. Click: Download
4. Files go to ~/Downloads
```

---

## ✅ METHOD 4: Using Cyberduck (Alternative GUI)

### Step 1: Download Cyberduck
```
Go to: https://cyberduck.io/
Click: Download for Mac
```

### Step 2: Install and Open
```
Open .dmg file
Drag to Applications
Open Cyberduck
```

### Step 3: New Connection
```
Click: Open Connection
Protocol: SFTP (SSH File Transfer Protocol)
Server: your-server-address
Username: your-username
Password: your-password
Click: Connect
```

### Step 4: Download Files
```
Navigate to: /mnt/user-data/outputs/
Double-click folder to open
Select files > Right-click > Download
```

---

## ⚡ QUICK COMMANDS (Terminal Method)

### Copy entire gatebook_hybrid folder:
```bash
scp -r username@server:/mnt/user-data/outputs/gatebook_hybrid ~/Downloads/
```

### Copy all documentation files:
```bash
scp username@server:/mnt/user-data/outputs/{START_HERE.md,REFACTORING_SUMMARY.md,EXTRACTION_GUIDE.md,app.html} ~/Downloads/
```

### Copy specific file:
```bash
scp username@server:/mnt/user-data/outputs/START_HERE.md ~/Downloads/
```

### Connect via SSH (if you need to explore):
```bash
ssh username@server
cd /mnt/user-data/outputs/
ls -la
```

---

## 🔍 WHERE TO FIND YOUR SERVER DETAILS

You should have:
- **Server Address/IP:** (e.g., 192.168.1.100 or example.com)
- **Username:** (your login username)
- **Password:** (your login password)
- **Port:** Usually 22 (for SFTP/SSH)

If you don't have these, ask your server admin or hosting provider.

---

## 📍 STEP-BY-STEP WITH TERMINAL (Safest Method)

### Step 1: Open Terminal
```
Cmd + Space → Type "Terminal" → Press Enter
```

### Step 2: Go to Downloads folder
```bash
cd ~/Downloads
```

### Step 3: Create a folder for your project (optional)
```bash
mkdir gatebook-refactored
cd gatebook-refactored
```

### Step 4: Download entire gatebook_hybrid folder
```bash
scp -r your-username@your-server.com:/mnt/user-data/outputs/gatebook_hybrid .
```

### Step 5: Download documentation files
```bash
scp your-username@your-server.com:/mnt/user-data/outputs/START_HERE.md .
scp your-username@your-server.com:/mnt/user-data/outputs/REFACTORING_SUMMARY.md .
scp your-username@your-server.com:/mnt/user-data/outputs/EXTRACTION_GUIDE.md .
scp your-username@your-server.com:/mnt/user-data/outputs/app.html .
```

### Step 6: Verify download
```bash
ls -la
```

You should see:
```
gatebook_hybrid/
START_HERE.md
REFACTORING_SUMMARY.md
EXTRACTION_GUIDE.md
app.html
```

---

## ✅ AFTER DOWNLOAD - NEXT STEPS

1. Open Finder > Downloads
2. Open `START_HERE.md` (double-click)
3. Read the guide
4. Follow instructions in `gatebook_hybrid/README.md`
5. Start extracting code (2-3 hours)

---

## 🚨 TROUBLESHOOTING

### "Permission denied"
```
Solution: Check username and password
Confirm you have access to /mnt/user-data/outputs/
Ask server admin if needed
```

### "Command not found: scp"
```
Solution: macOS should have scp built-in
Try updating macOS
Or use FileZilla/Cyberduck instead
```

### "Connection refused"
```
Solution: Check server address/IP is correct
Verify port 22 is open
Check if SSH/SFTP is enabled on server
Ask your server admin
```

### "No such file or directory"
```
Solution: Verify path is exactly: /mnt/user-data/outputs/
Check spelling and capitalization
Make sure /mnt exists on server
```

---

## 🎯 RECOMMENDED METHOD FOR MAC USERS

**For beginners:** Use **FileZilla** (Free, easy to use)
**For advanced users:** Use **Terminal with SCP** (Fastest)
**For Apple users:** Use **Cyberduck** (Mac-native, nice interface)

---

## 📌 IMPORTANT NOTES

✅ Files are **ready to download immediately**
✅ No special permissions needed
✅ Total size is only **~50 MB** (fast download)
✅ After download, follow `START_HERE.md`

---

## 💡 NEED HELP?

If you don't have:
- Server address/IP
- Username/password
- SSH/SFTP access

Ask whoever set up the server for these details, or check:
- Your hosting provider documentation
- Email confirmation of hosting account
- Server admin contact information

---

## 🎉 ONCE YOU'VE DOWNLOADED

1. ✅ Extract/unzip files (if needed)
2. ✅ Open `START_HERE.md`
3. ✅ Read `gatebook_hybrid/README.md`
4. ✅ Follow the extraction guide
5. ✅ Complete the refactoring (2-3 hours)
6. ✅ Deploy!

---

Good luck! Files are ready and waiting! 🚀

