document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("enter-button")
    .addEventListener("click", function () {
      document.getElementById("image-upload").click();
    });

  const colorBox = document.getElementById("colorBox");

  document
    .getElementById("image-upload")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        const img = new Image();
        img.src = reader.result;
        img.onload = function () {
          clearImageWrapper();
          const existingCanvas = document.querySelector(
            "#image-container .mainCanvas"
          );
          if (existingCanvas) {
            existingCanvas.parentNode.removeChild(existingCanvas); // Remove existing canvas
          }

          const existingImage = document.getElementById("uploaded-image");
          if (existingImage) {
            existingImage.parentNode.removeChild(existingImage); // Remove existing image
          }

          colorBox.style.display = "none";
          // Create and append the new uploaded image
          const uploadedImage = document.createElement("img");
          uploadedImage.id = "uploaded-image";
          uploadedImage.src = reader.result;
          uploadedImage.alt = "Uploaded Image";
          uploadedImage.style.width = "100%"; // Ensure the image fills its container
          uploadedImage.style.height = "100%"; // Ensure the image fills its container
          document.getElementById("image-wrapper").appendChild(uploadedImage);

          const canvas = document.createElement("canvas");
          canvas.classList.add("mainCanvas");
          canvas.width = uploadedImage.getBoundingClientRect().width;
          canvas.height = uploadedImage.getBoundingClientRect().height;
          canvas.style.position = "absolute";
          canvas.style.top = "60px";
          canvas.style.left = "0";
          canvas.style.zIndex = "0";
          document.getElementById("image-wrapper").appendChild(canvas); // Append canvas to image wrapper
          const ctx = canvas.getContext("2d");
          ctx.drawImage(
            uploadedImage,
            0,
            0,
            uploadedImage.getBoundingClientRect().width,
            uploadedImage.getBoundingClientRect().height
          );
          canvas.addEventListener("mousemove", handleCanvasMove); // Listen for mouse move events on the canvas
          canvas.addEventListener("mouseleave", hideMagnifier); // Listen for mouse leave events on the canvas
          canvas.addEventListener("click", handleCanvasClick); // Listen for click events on the canvas
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

  const imageWrapper = document.getElementById("image-container");
  console.log(imageWrapper.childNodes);

  function clearImageWrapper() {
    const imageWrapper = document.getElementById("image-wrapper");
    console.log(imageWrapper.childNodes);
    while (imageWrapper.firstChild) {
      imageWrapper.removeChild(imageWrapper.firstChild);
    }
  }

  document.getElementById("close-popup").addEventListener("click", function () {
    document.getElementById("color-popup").style.display = "none";
  });

  document
    .getElementById("alpha-slider")
    .addEventListener("input", function () {
      updateColorWithAlpha(this.value); // Update the color with the selected alpha value
    });

  function handleCanvasMove(event) {
    showMagnifier(event); // Show magnifier at current mouse position
  }

  function handleCanvasClick(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const ctx = event.target.getContext("2d");
    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];
    const a = pixelData[3] / 255; // Alpha value normalized to range [0, 1]
    const colorValue = rgbToHex(r, g, b);
    const baseColor = rgbToHex(
      Math.min(r + 50, 255),
      Math.min(g + 50, 255),
      Math.min(b + 50, 255)
    ); // Lighter shade of the chosen color
    document.getElementById("color-popup").style.display = "block";
    document.getElementById("color-box").style.backgroundColor = colorValue;
    document.getElementById(
      "color-value"
    ).textContent = `Color Value: ${colorValue}`;
    document.getElementById(
      "color-rgb"
    ).textContent = `RGB Value: (${r}, ${g}, ${b})`;
    document.getElementById("base-color-box").style.backgroundColor = baseColor;

    document.getElementById(
      "base-color-value"
    ).textContent = `Base Color Value: ${baseColor}`;
    document.getElementById(
      "base-color-rgb"
    ).textContent = `Base RGB Value: (${Math.min(r + 50, 255)}, ${Math.min(
      g + 50,
      255
    )}, ${Math.min(b + 50, 255)})`;
    const totalBaseColor =
      Math.min(r + 50, 255) + Math.min(g + 50, 255) + Math.min(b + 50, 255); // Total value of RGB components of the base color
    const totalChosenColor = r + g + b; // Total value of RGB components of the chosen color
    const percentage = Math.round((totalChosenColor / totalBaseColor) * 100);
    document.getElementById(
      "color-composition"
    ).textContent = `Percentage of base color in chosen color: ${percentage}%`;

    colorBox.style.left = `${x - 25}px`;
    colorBox.style.top = `${y + 30}px`;
    colorBox.style.backgroundColor = colorValue;
    colorBox.style.display = "block";
  }

  function showMagnifier(event) {
    const magnifier = document.getElementById("zoom");

    console.log(magnifier);

    const zoomCtx = magnifier.getContext("2d");
    // magnifier.style.display = 'block'; // Show magnifier
    // magnifier.style.left = `${event.offsetX - magnifier.offsetWidth / 2}px`; // Position magnifier at mouse X coordinate
    // magnifier.style.top = `${event.offsetY - magnifier.offsetHeight / 2}px`; // Position magnifier at mouse Y coordinate

    zoomCtx.drawImage(main, e.x, e.y, 200, 100, 0, 0, 400, 200);
    zoom.style.top = e.pageY + 10 + "px";
    zoom.style.left = e.pageX + 10 + "px";
    zoom.style.display = "block";
  }

  function hideMagnifier() {
    document.getElementById("magnifier").style.display = "none"; // Hide magnifier on mouse leave
  }

  function rgbToHex(r, g, b) {
    const rHex = (r < 16 ? "0" : "") + r.toString(16);
    const gHex = (g < 16 ? "0" : "") + g.toString(16);
    const bHex = (b < 16 ? "0" : "") + b.toString(16);
    return `#${rHex}${gHex}${bHex}`;
  }

  function updateColorWithAlpha(alpha) {
    const colorBox = document.getElementById("color-box");
    const colorBoxStyle = window.getComputedStyle(colorBox);
    const backgroundColor = colorBoxStyle.backgroundColor;
    const rgbValues = backgroundColor.match(/\d+/g);
    const adjustedRgbValues = rgbValues.map((value) =>
      Math.round(value * alpha)
    );
    const hexCode = rgbToHex(
      adjustedRgbValues[0],
      adjustedRgbValues[1],
      adjustedRgbValues[2]
    );
    colorBox.style.opacity = alpha;
    document.getElementById(
      "color-rgb"
    ).textContent = `RGB Value: (${adjustedRgbValues[0]}, ${adjustedRgbValues[1]}, ${adjustedRgbValues[2]})`;
    document.getElementById(
      "color-value"
    ).textContent = `Color Value: ${hexCode}`;
  }
});
