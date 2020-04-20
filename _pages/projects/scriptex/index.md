---
layout: page_hidden
title:  "ScriptEx(Dee|Dee II)"
permalink: "/projects/scriptex"
---

**ScriptEx**, with later revisions **ScriptExDee** and **ScriptExDee II**, is a passion project developed in my spare time with the goal of streamlining software installation, system testing, and quality control at <abbr title="PC Case Gear">PCCG</abbr>. ScriptEx and its future revisions were branched from an existing GUI-based _Builder Companion_ program, written by Magnus Hjorth. 

The intent was to create a lightweight, portable, and flexible platform with core functionality that could be modified on-site (without recompilation).



## Main Features

* **Asynchronous Operation**: Allows for multithreaded transfer of files using `robocopy` and installation of system drivers, manufacturer software, and lighting controllers in  batched jobs. 
* **Background Windows Updater**: Updates are downloaded and installed in the background during software setup and system stability testing. Restarts can automatically occur once testing has completed. 
* **Portable & Flexible**: Can be configured to be deployed from any removable device and pull the latest software from either a local network or the removable drive itself. 
* **Windows Integration**: ScriptEx can read Windows system hardware information, check for activation keys, and self-cleanup when ready for quality control. 


## Dependencies

ScriptEx is written in C# on .NET 4.7.2. This platform was chosen due to its closeness to the Windows OS, easy access to <abbr title="Windows Management Instruments">WMI</abbr>, and relatively simple multithreading.

[Fody Costura](https://github.com/Fody/Costura) is utilised during compilation to bundle required assemblies (`.dll` files) into a single executable. Required assemblies include:
* [YamlDotNet](https://github.com/aaubry/YamlDotNet)
* [WUApiLib](https://docs.microsoft.com/en-us/windows/win32/wua_sdk/windows-update-agent-object-model)
* Microsoft.Win32.TaskScheduler
* Microsoft.Win32.Registry
* System.Security.AccessControl
* System.Security.Principal.Windows


## Repository

The repository for ScriptEx is currently private. Please contact me if you require access.







