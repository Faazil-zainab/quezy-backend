[app]

# App identity
package.name = quezy
package.domain = org.quezy
title = QUEZY Mobile

# Source code
source.dir = .
source.include_exts = py,png,jpg,jpeg,kv,atlas
source.exclude_patterns = __pycache__/*,*.pyc,.git/*

# Version
version = 0.1.0

# Entry point
requirements = python3,kivy,requests,plyer

# Main Python file
entrypoint = main.py

# UI options
orientation = portrait
fullscreen = 0

# Permissions needed by this app
android.permissions = INTERNET,ACCESS_FINE_LOCATION,ACCESS_COARSE_LOCATION

# Android API setup
android.api = 34
android.minapi = 21
android.ndk = 25b
android.archs = arm64-v8a,armeabi-v7a

# Keep logs helpful during first builds
log_level = 2

[buildozer]
warn_on_root = 1
