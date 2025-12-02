import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ARPreview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const modelViewerRef = useRef(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [arSupported, setArSupported] = useState(false);
    const [arMode, setArMode] = useState('auto');

    // Get product data from navigation state with fallback
    const product = location.state?.product || {
        name: "Sample Product",
        modelUrl: "/models3d/thermos_-_hydration_bottle_24oz.glb",
        iosModelUrl: "/models3d/Thermos_-_Hydration_Bottle_24OZ.usdz",
        image: ""
    };

    console.log('Product data:', product);
    console.log('Model URL:', product.modelUrl);

    // Load model-viewer script
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';

        script.onload = () => {
            console.log('Model Viewer script loaded successfully');

            // Check AR support
            checkARSupport();
        };

        script.onerror = () => {
            setError('Failed to load 3D viewer library. Please check your internet connection.');
            setIsLoading(false);
        };

        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    // Check AR Support
    const checkARSupport = async () => {
        try {
            // Get device and browser info
            const userAgent = navigator.userAgent;
            const isIOS = /iPad|iPhone|iPod/.test(userAgent);
            const isAndroid = /Android/.test(userAgent);
            const isChrome = /Chrome/.test(userAgent);
            const isFirefox = /Firefox/.test(userAgent);
            const isEdge = /Edg/.test(userAgent);
            const isSafari = /Safari/.test(userAgent) && !isChrome;
            const isDesktop = !isIOS && !isAndroid;

            console.log('=== AR SUPPORT DETECTION ===');
            console.log('User Agent:', userAgent);
            console.log('---Device Type---');
            console.log('Is iOS:', isIOS);
            console.log('Is Android:', isAndroid);
            console.log('Is Desktop:', isDesktop);
            console.log('---Browser Type---');
            console.log('Is Chrome:', isChrome);
            console.log('Is Firefox:', isFirefox);
            console.log('Is Edge:', isEdge);
            console.log('Is Safari:', isSafari);

            // Case 1: Desktop/Laptop → WebXR not available
            if (isDesktop) {
                console.warn('❌ CASE 1: Desktop/Laptop detected');
                console.warn('WebXR not available on desktop browsers');
                console.warn('Display: "🚫 AR Not Available"');
                setArSupported(false);
                return;
            }

            // Case 2: Android + Firefox/Edge → No WebXR support
            if (isAndroid && (isFirefox || isEdge)) {
                console.warn('❌ CASE 2: Android with Firefox or Edge detected');
                console.warn('WebXR support requires Chrome on Android');
                console.warn('Browser detected:', isFirefox ? 'Firefox' : 'Edge');
                console.warn('Display: Hidden (AR button not shown)');
                setArSupported(false);
                return;
            }

            // Case 3: iPhone + Chrome → Safari required for AR
            if (isIOS && isChrome) {
                console.warn('❌ CASE 3: iOS with Chrome detected');
                console.warn('AR requires Safari browser on iOS, not Chrome');
                console.warn('Display: Hidden (AR button not shown)');
                setArSupported(false);
                return;
            }

            // Case 4 & 5: Check for iOS version and ARKit support
            if (isIOS) {
                const iOSVersionMatch = userAgent.match(/OS (\d+)_(\d+)/);
                const iOSVersion = iOSVersionMatch ? parseInt(iOSVersionMatch[1]) : 0;

                console.log('iOS Version detected:', iOSVersion);

                // Case 4: Old iOS (<12) → No ARKit
                if (iOSVersion < 12) {
                    console.warn('❌ CASE 4: Old iOS version detected (<12)');
                    console.warn('ARKit requires iOS 12 or higher');
                    console.warn('Current iOS version:', iOSVersion);
                    console.warn('Display: Hidden (AR button not shown)');
                    setArSupported(false);
                    return;
                }

                console.log('✅ iOS version supported for ARKit (iOS', iOSVersion, '+)');
            }

            // Check WebXR support for Android
            if (isAndroid) {
                console.log('Checking WebXR support for Android...');

                let xrSupport = false;
                try {
                    xrSupport = navigator.xr &&
                        (await navigator.xr.isSessionSupported('immersive-ar').catch((err) => {
                            console.warn('WebXR session check failed:', err);
                            return false;
                        }));
                } catch (err) {
                    console.error('Error checking WebXR:', err);
                }

                if (!xrSupport) {
                    console.warn('❌ CASE 5: Device without AR hardware detected');
                    console.warn('WebXR immersive-ar mode not supported');
                    console.warn('Possible reasons:');
                    console.warn('  - ARCore not installed');
                    console.warn('  - Device lacks AR hardware');
                    console.warn('  - Browser ARCore support missing');
                    console.warn('Display: Hidden (AR button not shown)');
                    setArSupported(false);
                    return;
                }

                console.log('✅ WebXR support detected on Android');
            }

            // If we reach here, AR is supported
            console.log('✅ AR is ENABLED and supported on this device');
            console.log('Button will display: "📱 View in Your Space"');
            setArSupported(true);

        } catch (err) {
            console.error('❌ Unexpected error during AR support check:', err);
            setArSupported(false);
        }
    };

    // Validate model URL accessibility
    useEffect(() => {
        const validateModelUrl = async () => {
            try {
                if (product.modelUrl.startsWith('file://') ||
                    product.modelUrl.startsWith('C:') ||
                    product.modelUrl.startsWith('/Users/') ||
                    product.modelUrl.includes('\\')) {
                    setError('Local file paths are not supported. Use paths like "/models3d/yourmodel.glb"');
                    setIsLoading(false);
                    return;
                }

                // Only validate HTTP URLs
                if (product.modelUrl.startsWith('http')) {
                    const response = await fetch(product.modelUrl, {
                        method: 'HEAD',
                        mode: 'cors'
                    });

                    if (!response.ok) {
                        setError(`Model file not accessible: HTTP ${response.status}`);
                        setIsLoading(false);
                    }
                }
            } catch (err) {
                console.error('Model validation error:', err);
                setIsLoading(false);
            }
        };

        validateModelUrl();
    }, [product.modelUrl]);

    // Handle model-viewer events
    // Handle model-viewer events
    useEffect(() => {
        const modelViewer = modelViewerRef.current;
        if (!modelViewer) return;

        const handleLoad = () => {
            console.log('✅ Model loaded successfully');
            console.log('Model dimensions:', {
                width: modelViewer.getDimensions?.().x,
                height: modelViewer.getDimensions?.().y,
                depth: modelViewer.getDimensions?.().z
            });
            setIsLoading(false);
            setError(null);
        };

        const handleError = (event) => {
            console.error('❌ CASE 6: Model loading failed');
            console.error('Error event:', event);
            console.error('Model URL attempted:', product.modelUrl);
            console.error('File format should be: .glb or .usdz');
            console.error('Display: Hidden (AR button) + Error message shown');

            const errorMsg = product.modelUrl.startsWith('file://')
                ? 'Local file:// URLs are blocked. Use /models3d/yourfile.glb'
                : `Failed to load 3D model from: ${product.modelUrl}`;

            setError(errorMsg);
            setIsLoading(false);
        };

        const handleProgress = (event) => {
            const progress = event.detail.totalProgress;
            console.log(`Model loading progress: ${(progress * 100).toFixed(0)}%`);
        };

        const handleARStatus = (event) => {
  console.log('AR Status Update:', event.detail);
  console.log('Current AR mode status:', event.detail.status);
  
  if (event.detail.status === 'failed' || event.detail.status === 'not-presenting') {
    console.warn('❌ CASE 7: AR activation failed');
    console.warn('WebXR session creation error');
    console.warn('Scene Viewer error');
    console.warn('Quick Look error');
    console.warn('Possible reasons:');
    console.warn('  1. Model scale too small (current:', {
      width: modelViewerRef.current?.getDimensions?.().x,
      height: modelViewerRef.current?.getDimensions?.().y,
      depth: modelViewerRef.current?.getDimensions?.().z
    }, ')');
    console.warn('  2. Camera permissions denied');
    console.warn('  3. ARCore runtime not initialized');
    console.warn('  4. Device moved during AR placement');
    console.warn('  5. No flat surface detected');
    
    setError('AR failed to initialize. Try:\n1. Grant camera permissions\n2. Keep device still\n3. Point at a flat surface');
  }
};

        modelViewer.addEventListener('load', handleLoad);
        modelViewer.addEventListener('error', handleError);
        modelViewer.addEventListener('progress', handleProgress);
        modelViewer.addEventListener('ar-status', handleARStatus);

        return () => {
            modelViewer.removeEventListener('load', handleLoad);
            modelViewer.removeEventListener('error', handleError);
            modelViewer.removeEventListener('progress', handleProgress);
            modelViewer.removeEventListener('ar-status', handleARStatus);
        };
    }, [product.modelUrl]);


    const handleBack = () => {
        navigate(-1);
    };

    const handleARButtonClick = async () => {
        const modelViewer = modelViewerRef.current;

        if (!modelViewer) {
            console.error('Model viewer not found');
            return;
        }

        try {
            // Try to activate AR
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

            if (isIOS) {
                // For iOS, trigger quick-look
                console.log('Attempting iOS AR Quick Look...');
                // The ar-button slot should handle this, but we can also trigger manually
                const arButton = modelViewer.querySelector('[slot="ar-button"]');
                if (arButton) {
                    arButton.click();
                }
            } else {
                // For Android WebXR
                console.log('Attempting WebXR AR session...');
                if (modelViewer.canActivateAR) {
                    console.log('AR can be activated');
                    const session = await modelViewer.activateAR?.();
                    console.log('AR session activated:', session);
                } else {
                    setError('AR is not supported on this device. Please ensure:\n1. You have ARCore installed (Android)\n2. You have ARKit support (iOS)\n3. Your browser supports WebXR');
                }
            }
        } catch (err) {
            console.error('AR activation error:', err);
            setError(`AR activation failed: ${err.message}`);
        }
    };

    

// Before model-viewer JSX
const handleManualARMode = (mode) => {
  console.log('Attempting AR mode:', mode);
  setArMode(mode);
  
  const modelViewer = modelViewerRef.current;
  if (!modelViewer) return;

  if (mode === 'webxr') {
    modelViewer.setAttribute('ar-modes', 'webxr');
  } else if (mode === 'scene-viewer') {
    modelViewer.setAttribute('ar-modes', 'scene-viewer');
  } else if (mode === 'quick-look') {
    modelViewer.setAttribute('ar-modes', 'quick-look');
  }
};

// Add this UI before the AR button
{!arSupported ? null : (
  <div style={{
    position: 'absolute',
    top: '32px',
    right: '32px',
    zIndex: 10,
    background: 'white',
    padding: '12px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}>
    <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>AR Modes:</p>
    <button 
      onClick={() => handleManualARMode('webxr')}
      style={{
        display: 'block',
        width: '100%',
        padding: '8px',
        marginBottom: '4px',
        background: arMode === 'webxr' ? '#60a5fa' : '#e5e7eb',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
      }}
    >
      WebXR
    </button>
    <button 
      onClick={() => handleManualARMode('scene-viewer')}
      style={{
        display: 'block',
        width: '100%',
        padding: '8px',
        marginBottom: '4px',
        background: arMode === 'scene-viewer' ? '#60a5fa' : '#e5e7eb',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
      }}
    >
      Scene Viewer
    </button>
    <button 
      onClick={() => handleManualARMode('quick-look')}
      style={{
        display: 'block',
        width: '100%',
        padding: '8px',
        background: arMode === 'quick-look' ? '#60a5fa' : '#e5e7eb',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
      }}
    >
      Quick Look
    </button>
  </div>
)}

const launchSceneViewerDirectly = () => {
  console.log('Attempting direct Scene Viewer launch...');
  
  // Construct Scene Viewer intent URL
  const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(window.location.origin + product.modelUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
  
  console.log('Scene Viewer URL:', sceneViewerUrl);
  
  // Try to open
  window.location.href = sceneViewerUrl;
};


    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-30 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <button
                            onClick={handleBack}
                            className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-400 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
                            </svg>
                            Back
                        </button>
                    </div>
                </div>
            </header>

            {/* AR Viewer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        AR Preview
                    </h1>
                    <p className="text-gray-600">
                        View <span className="font-semibold text-blue-400">{product.name}</span> in your space
                    </p>
                    {!arSupported && (
                        <p className="text-sm text-orange-600 mt-2">
                            ⚠️ AR may not be supported on this device/browser
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 text-blue-400"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <div>
                                <p className="text-red-800 text-sm font-semibold">Error</p>
                                <p className="text-red-700 text-sm mt-1 whitespace-pre-wrap">{error}</p>
                            </div>


                        </div>
                    </div>
                )}

                {/* Model Viewer Container */}
                <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg relative">
                    {isLoading && !error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                                <p className="text-gray-600 font-medium">Loading 3D Model...</p>
                                <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
                            </div>
                        </div>
                    )}

                    <model-viewer
  ref={modelViewerRef}
  src={product.modelUrl}
  ios-src={product.iosModelUrl}
  alt={`3D model of ${product.name}`}
  scale="0.001 0.001 0.001"  // SCALE DOWN BY 1000x
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  auto-rotate
  shadow-intensity="1"
  exposure="0.8"
  environment-image="neutral"
  loading="eager"
  reveal="auto"
  style={{
    width: '100%',
    height: '70vh',
    minHeight: '500px',
    backgroundColor: '#f9fafb'
  }}
>
                        {/* AR Button - Built-in */}
                        <button
                            slot="ar-button"
                            className="ar-button"
                            style={{
                                position: 'absolute',
                                bottom: '32px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                padding: '16px 32px',
                                backgroundColor: '#60a5fa',
                                color: 'white',
                                borderRadius: '9999px',
                                fontWeight: '600',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                                zIndex: 10,
                                transition: 'all 0.3s ease',
                                display: arSupported ? 'block' : 'none'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#3b82f6'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#60a5fa'}
                        >
                            📱 View in Your Space
                        </button>

                        <button 
                            onClick={launchSceneViewerDirectly}
                            style={{
                                position: 'absolute',
                                bottom: '90px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                padding: '12px 24px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                borderRadius: '9999px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                zIndex: 10
                            }}
                            >
                            🔧 Try Scene Viewer
                            </button>

                        {/* Fallback AR Button */}
                        {!arSupported && (
                            <div style={{
                                position: 'absolute',
                                bottom: '32px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                padding: '16px 32px',
                                backgroundColor: '#9ca3af',
                                color: 'white',
                                borderRadius: '9999px',
                                fontWeight: '600',
                                zIndex: 10,
                                cursor: 'not-allowed',
                                fontSize: '14px'
                            }}>
                                🚫 AR Not Available
                            </div>
                        )}

                        <div slot="poster" style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f9fafb'
                        }}>
                            <div className="text-gray-400">Loading...</div>
                        </div>
                    </model-viewer>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        How to use AR
                    </h3>
                    <div className="space-y-3 text-gray-700">
                        <div className="flex items-start">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-400 text-white text-sm font-bold mr-3 flex-shrink-0 mt-0.5">1</span>
                            <p><span className="font-semibold">Rotate & Zoom:</span> Use your mouse/touch to explore the 3D model</p>
                        </div>
                        <div className="flex items-start">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-400 text-white text-sm font-bold mr-3 flex-shrink-0 mt-0.5">2</span>
                            <p><span className="font-semibold">View in AR:</span> Click "View in Your Space" button (if available on your device)</p>
                        </div>
                        <div className="flex items-start">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-400 text-white text-sm font-bold mr-3 flex-shrink-0 mt-0.5">3</span>
                            <p><span className="font-semibold">Place Object:</span> Point your camera at a flat surface and tap to place</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-blue-100">
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-semibold">Requirements:</span>
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1 list-inside">
                            <li>✓ Android: Chrome browser + ARCore support (Google Play Services for AR)</li>
                            <li>✓ iOS: Safari browser + ARKit support (iOS 12+)</li>
                            <li>✓ Compatible device with camera</li>
                            <li>✓ Permissions: Camera access required</li>
                        </ul>
                    </div>
                </div>

                {/* Model Info */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">📱</div>
                        <h4 className="font-semibold text-gray-900 mb-1">Mobile Ready</h4>
                        <p className="text-sm text-gray-600">Works on compatible smartphones</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">🔄</div>
                        <h4 className="font-semibold text-gray-900 mb-1">360° View</h4>
                        <p className="text-sm text-gray-600">Explore from every angle</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">📏</div>
                        <h4 className="font-semibold text-gray-900 mb-1">True Scale</h4>
                        <p className="text-sm text-gray-600">See actual product size in AR</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ARPreview;