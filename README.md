# BCI Chromium Brightness Extension (natHACKS 2022)

By: Eric Xiong, Connor Chin, Zack Dorward

Installation:

Clone the repository, no packages needed.
In Google Chrome Extensions, switch to developer mode and click load unpacked. Navigate to the repository folder. Enable the extension.

Usage:
Two buttons appear on all webpages on the top left with the http or https protocol.
The first button allows you to connect your Muse S hardware via the Web Bluetooth API.

The second button allows two modes that are switchable by clicking.
  Toggle: By raising your eyebrows you can toggle the screen dimmer.
  Dynamic: The screen brightness is adjusted based on the Alpha/Beta frequency ratio using the Fast Fourier Transform.

By clicking on the popup menu and going to the Metrics page you can look at a real-time graph of your Alpha/Beta frequency ratio.

Packages used:
fft-js,
Plotly.js,
BCI Web Browser Boilerplate (using the Web Bluetooth API) by Brainsatplay

Special thanks:
natHACKS 2022 Mentors and Organizers,
Brainsatplay for providing the Boilerplate
