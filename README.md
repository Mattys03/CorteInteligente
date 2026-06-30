# Corte Inteligente (Smart Cut) - Adobe Premiere Extension

<div align="center">
  <a href="https://github.com/Mattys03/CorteInteligente/releases/latest">
    <img src="https://img.shields.io/badge/📦_Download_Release-FF0000?style=for-the-badge&logo=adobe" alt="Download Release" />
  </a>
</div>

![Platform](https://img.shields.io/badge/Platform-Adobe%20Premiere%20Pro-blue)
![Tech](https://img.shields.io/badge/Tech-CEP%20%7C%20ExtendScript-green)
![License](https://img.shields.io/badge/License-MIT-purple)

**Corte Inteligente** is an Adobe CEP (Common Extensibility Platform) Extension designed for Adobe Premiere Pro. It drastically speeds up the video editing workflow by automating tedious cutting and timeline manipulation tasks. 

By bridging modern Web Technologies (HTML/JS/CSS) with Adobe's internal ExtendScript (JSX), this extension provides a seamless panel directly inside Premiere Pro.

## 🚀 Features

- **Automated Timeline Operations:** Programmatically trigger cuts, deletes, and ripples.
- **Native Premiere Integration:** Operates directly inside the Premiere Pro UI as a dockable panel.
- **ExtendScript (JSX) Backend:** Interacts directly with the Premiere Pro DOM to manipulate sequences, tracks, and clips.
- **Modern UI:** Built with HTML/JS, running on the embedded Chromium framework provided by Adobe CEP.

## 🛠️ Architecture

- **`CSXS/manifest.xml`**: Extension configuration, defining panel size, Adobe host versions (Premiere Pro), and entry points.
- **`index.html` & `CSInterface.js`**: The frontend UI of the extension and the Adobe integration bridge.
- **`jsx/`**: ExtendScript backend files that execute native Premiere API commands.

## 📦 Installation

### For Users (ZXP)
*(Assuming you package the extension as a `.zxp` file)*
1. Download a ZXP Installer (like Anastasiy's Extension Manager).
2. Install the `CorteInteligente.zxp` file.
3. In Premiere Pro, go to **Window -> Extensions -> Corte Inteligente**.

### For Developers (Debug Mode)
1. Clone the repository into your Adobe CEP extensions folder (usually `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\` on Windows).
2. Enable `PlayerDebugMode` in the Windows Registry to allow loading unsigned extensions.
   - You can run the provided `INSTALAR.bat` to automatically set up the registry and create a symlink to the extension folder.
3. Restart Premiere Pro.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
