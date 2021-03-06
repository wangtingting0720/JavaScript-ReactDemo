/* */ 
(function(process) {
  'use strict';
  if (process.env.NODE_ENV !== "production") {
    (function() {
      'use strict';
      var React = require('react');
      var invariant = require('fbjs/lib/invariant');
      var warning = require('fbjs/lib/warning');
      var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
      var _assign = require('object-assign');
      var emptyFunction$1 = require('fbjs/lib/emptyFunction');
      var EventListener = require('fbjs/lib/EventListener');
      var getActiveElement = require('fbjs/lib/getActiveElement');
      var shallowEqual = require('fbjs/lib/shallowEqual');
      var containsNode = require('fbjs/lib/containsNode');
      var focusNode = require('fbjs/lib/focusNode');
      var emptyObject = require('fbjs/lib/emptyObject');
      var checkPropTypes = require('prop-types/checkPropTypes');
      var hyphenateStyleName = require('fbjs/lib/hyphenateStyleName');
      var camelizeStyleName = require('fbjs/lib/camelizeStyleName');
      !React ? invariant(false, 'ReactDOM was loaded before React. Make sure you load the React package before loading ReactDOM.') : void 0;
      var RESERVED_PROPS = {
        children: true,
        dangerouslySetInnerHTML: true,
        defaultValue: true,
        defaultChecked: true,
        innerHTML: true,
        suppressContentEditableWarning: true,
        suppressHydrationWarning: true,
        style: true
      };
      function checkMask(value, bitmask) {
        return (value & bitmask) === bitmask;
      }
      var DOMPropertyInjection = {
        MUST_USE_PROPERTY: 0x1,
        HAS_BOOLEAN_VALUE: 0x4,
        HAS_NUMERIC_VALUE: 0x8,
        HAS_POSITIVE_NUMERIC_VALUE: 0x10 | 0x8,
        HAS_OVERLOADED_BOOLEAN_VALUE: 0x20,
        HAS_STRING_BOOLEAN_VALUE: 0x40,
        injectDOMPropertyConfig: function(domPropertyConfig) {
          var Injection = DOMPropertyInjection;
          var Properties = domPropertyConfig.Properties || {};
          var DOMAttributeNamespaces = domPropertyConfig.DOMAttributeNamespaces || {};
          var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
          var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};
          for (var propName in Properties) {
            !!properties.hasOwnProperty(propName) ? invariant(false, "injectDOMPropertyConfig(...): You're trying to inject DOM property '%s' which has already been injected. You may be accidentally injecting the same DOM property config twice, or you may be injecting two configs that have conflicting property names.", propName) : void 0;
            var lowerCased = propName.toLowerCase();
            var propConfig = Properties[propName];
            var propertyInfo = {
              attributeName: lowerCased,
              attributeNamespace: null,
              propertyName: propName,
              mutationMethod: null,
              mustUseProperty: checkMask(propConfig, Injection.MUST_USE_PROPERTY),
              hasBooleanValue: checkMask(propConfig, Injection.HAS_BOOLEAN_VALUE),
              hasNumericValue: checkMask(propConfig, Injection.HAS_NUMERIC_VALUE),
              hasPositiveNumericValue: checkMask(propConfig, Injection.HAS_POSITIVE_NUMERIC_VALUE),
              hasOverloadedBooleanValue: checkMask(propConfig, Injection.HAS_OVERLOADED_BOOLEAN_VALUE),
              hasStringBooleanValue: checkMask(propConfig, Injection.HAS_STRING_BOOLEAN_VALUE)
            };
            !(propertyInfo.hasBooleanValue + propertyInfo.hasNumericValue + propertyInfo.hasOverloadedBooleanValue <= 1) ? invariant(false, "DOMProperty: Value can be one of boolean, overloaded boolean, or numeric value, but not a combination: %s", propName) : void 0;
            if (DOMAttributeNames.hasOwnProperty(propName)) {
              var attributeName = DOMAttributeNames[propName];
              propertyInfo.attributeName = attributeName;
            }
            if (DOMAttributeNamespaces.hasOwnProperty(propName)) {
              propertyInfo.attributeNamespace = DOMAttributeNamespaces[propName];
            }
            if (DOMMutationMethods.hasOwnProperty(propName)) {
              propertyInfo.mutationMethod = DOMMutationMethods[propName];
            }
            properties[propName] = propertyInfo;
          }
        }
      };
      var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
      var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
      var ROOT_ATTRIBUTE_NAME = 'data-reactroot';
      var properties = {};
      function shouldSetAttribute(name, value) {
        if (isReservedProp(name)) {
          return false;
        }
        if (name.length > 2 && (name[0] === 'o' || name[0] === 'O') && (name[1] === 'n' || name[1] === 'N')) {
          return false;
        }
        if (value === null) {
          return true;
        }
        switch (typeof value) {
          case 'boolean':
            return shouldAttributeAcceptBooleanValue(name);
          case 'undefined':
          case 'number':
          case 'string':
          case 'object':
            return true;
          default:
            return false;
        }
      }
      function getPropertyInfo(name) {
        return properties.hasOwnProperty(name) ? properties[name] : null;
      }
      function shouldAttributeAcceptBooleanValue(name) {
        if (isReservedProp(name)) {
          return true;
        }
        var propertyInfo = getPropertyInfo(name);
        if (propertyInfo) {
          return propertyInfo.hasBooleanValue || propertyInfo.hasStringBooleanValue || propertyInfo.hasOverloadedBooleanValue;
        }
        var prefix = name.toLowerCase().slice(0, 5);
        return prefix === 'data-' || prefix === 'aria-';
      }
      function isReservedProp(name) {
        return RESERVED_PROPS.hasOwnProperty(name);
      }
      var injection = DOMPropertyInjection;
      var MUST_USE_PROPERTY = injection.MUST_USE_PROPERTY;
      var HAS_BOOLEAN_VALUE = injection.HAS_BOOLEAN_VALUE;
      var HAS_NUMERIC_VALUE = injection.HAS_NUMERIC_VALUE;
      var HAS_POSITIVE_NUMERIC_VALUE = injection.HAS_POSITIVE_NUMERIC_VALUE;
      var HAS_OVERLOADED_BOOLEAN_VALUE = injection.HAS_OVERLOADED_BOOLEAN_VALUE;
      var HAS_STRING_BOOLEAN_VALUE = injection.HAS_STRING_BOOLEAN_VALUE;
      var HTMLDOMPropertyConfig = {
        Properties: {
          allowFullScreen: HAS_BOOLEAN_VALUE,
          autoFocus: HAS_STRING_BOOLEAN_VALUE,
          async: HAS_BOOLEAN_VALUE,
          autoPlay: HAS_BOOLEAN_VALUE,
          capture: HAS_BOOLEAN_VALUE,
          checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          cols: HAS_POSITIVE_NUMERIC_VALUE,
          contentEditable: HAS_STRING_BOOLEAN_VALUE,
          controls: HAS_BOOLEAN_VALUE,
          'default': HAS_BOOLEAN_VALUE,
          defer: HAS_BOOLEAN_VALUE,
          disabled: HAS_BOOLEAN_VALUE,
          download: HAS_OVERLOADED_BOOLEAN_VALUE,
          draggable: HAS_STRING_BOOLEAN_VALUE,
          formNoValidate: HAS_BOOLEAN_VALUE,
          hidden: HAS_BOOLEAN_VALUE,
          loop: HAS_BOOLEAN_VALUE,
          multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          noValidate: HAS_BOOLEAN_VALUE,
          open: HAS_BOOLEAN_VALUE,
          playsInline: HAS_BOOLEAN_VALUE,
          readOnly: HAS_BOOLEAN_VALUE,
          required: HAS_BOOLEAN_VALUE,
          reversed: HAS_BOOLEAN_VALUE,
          rows: HAS_POSITIVE_NUMERIC_VALUE,
          rowSpan: HAS_NUMERIC_VALUE,
          scoped: HAS_BOOLEAN_VALUE,
          seamless: HAS_BOOLEAN_VALUE,
          selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
          size: HAS_POSITIVE_NUMERIC_VALUE,
          start: HAS_NUMERIC_VALUE,
          span: HAS_POSITIVE_NUMERIC_VALUE,
          spellCheck: HAS_STRING_BOOLEAN_VALUE,
          style: 0,
          tabIndex: 0,
          itemScope: HAS_BOOLEAN_VALUE,
          acceptCharset: 0,
          className: 0,
          htmlFor: 0,
          httpEquiv: 0,
          value: HAS_STRING_BOOLEAN_VALUE
        },
        DOMAttributeNames: {
          acceptCharset: 'accept-charset',
          className: 'class',
          htmlFor: 'for',
          httpEquiv: 'http-equiv'
        },
        DOMMutationMethods: {value: function(node, value) {
            if (value == null) {
              return node.removeAttribute('value');
            }
            if (node.type !== 'number' || node.hasAttribute('value') === false) {
              node.setAttribute('value', '' + value);
            } else if (node.validity && !node.validity.badInput && node.ownerDocument.activeElement !== node) {
              node.setAttribute('value', '' + value);
            }
          }}
      };
      var HAS_STRING_BOOLEAN_VALUE$1 = injection.HAS_STRING_BOOLEAN_VALUE;
      var NS = {
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace'
      };
      var ATTRS = ['accent-height', 'alignment-baseline', 'arabic-form', 'baseline-shift', 'cap-height', 'clip-path', 'clip-rule', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'dominant-baseline', 'enable-background', 'fill-opacity', 'fill-rule', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-name', 'glyph-orientation-horizontal', 'glyph-orientation-vertical', 'horiz-adv-x', 'horiz-origin-x', 'image-rendering', 'letter-spacing', 'lighting-color', 'marker-end', 'marker-mid', 'marker-start', 'overline-position', 'overline-thickness', 'paint-order', 'panose-1', 'pointer-events', 'rendering-intent', 'shape-rendering', 'stop-color', 'stop-opacity', 'strikethrough-position', 'strikethrough-thickness', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'text-anchor', 'text-decoration', 'text-rendering', 'underline-position', 'underline-thickness', 'unicode-bidi', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic', 'v-mathematical', 'vector-effect', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'word-spacing', 'writing-mode', 'x-height', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xmlns:xlink', 'xml:lang', 'xml:space'];
      var SVGDOMPropertyConfig = {
        Properties: {
          autoReverse: HAS_STRING_BOOLEAN_VALUE$1,
          externalResourcesRequired: HAS_STRING_BOOLEAN_VALUE$1,
          preserveAlpha: HAS_STRING_BOOLEAN_VALUE$1
        },
        DOMAttributeNames: {
          autoReverse: 'autoReverse',
          externalResourcesRequired: 'externalResourcesRequired',
          preserveAlpha: 'preserveAlpha'
        },
        DOMAttributeNamespaces: {
          xlinkActuate: NS.xlink,
          xlinkArcrole: NS.xlink,
          xlinkHref: NS.xlink,
          xlinkRole: NS.xlink,
          xlinkShow: NS.xlink,
          xlinkTitle: NS.xlink,
          xlinkType: NS.xlink,
          xmlBase: NS.xml,
          xmlLang: NS.xml,
          xmlSpace: NS.xml
        }
      };
      var CAMELIZE = /[\-\:]([a-z])/g;
      var capitalize = function(token) {
        return token[1].toUpperCase();
      };
      ATTRS.forEach(function(original) {
        var reactName = original.replace(CAMELIZE, capitalize);
        SVGDOMPropertyConfig.Properties[reactName] = 0;
        SVGDOMPropertyConfig.DOMAttributeNames[reactName] = original;
      });
      injection.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
      injection.injectDOMPropertyConfig(SVGDOMPropertyConfig);
      var ReactErrorUtils = {
        _caughtError: null,
        _hasCaughtError: false,
        _rethrowError: null,
        _hasRethrowError: false,
        injection: {injectErrorUtils: function(injectedErrorUtils) {
            !(typeof injectedErrorUtils.invokeGuardedCallback === 'function') ? invariant(false, 'Injected invokeGuardedCallback() must be a function.') : void 0;
            invokeGuardedCallback = injectedErrorUtils.invokeGuardedCallback;
          }},
        invokeGuardedCallback: function(name, func, context, a, b, c, d, e, f) {
          invokeGuardedCallback.apply(ReactErrorUtils, arguments);
        },
        invokeGuardedCallbackAndCatchFirstError: function(name, func, context, a, b, c, d, e, f) {
          ReactErrorUtils.invokeGuardedCallback.apply(this, arguments);
          if (ReactErrorUtils.hasCaughtError()) {
            var error = ReactErrorUtils.clearCaughtError();
            if (!ReactErrorUtils._hasRethrowError) {
              ReactErrorUtils._hasRethrowError = true;
              ReactErrorUtils._rethrowError = error;
            }
          }
        },
        rethrowCaughtError: function() {
          return rethrowCaughtError.apply(ReactErrorUtils, arguments);
        },
        hasCaughtError: function() {
          return ReactErrorUtils._hasCaughtError;
        },
        clearCaughtError: function() {
          if (ReactErrorUtils._hasCaughtError) {
            var error = ReactErrorUtils._caughtError;
            ReactErrorUtils._caughtError = null;
            ReactErrorUtils._hasCaughtError = false;
            return error;
          } else {
            invariant(false, 'clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.');
          }
        }
      };
      var invokeGuardedCallback = function(name, func, context, a, b, c, d, e, f) {
        ReactErrorUtils._hasCaughtError = false;
        ReactErrorUtils._caughtError = null;
        var funcArgs = Array.prototype.slice.call(arguments, 3);
        try {
          func.apply(context, funcArgs);
        } catch (error) {
          ReactErrorUtils._caughtError = error;
          ReactErrorUtils._hasCaughtError = true;
        }
      };
      {
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof document !== 'undefined' && typeof document.createEvent === 'function') {
          var fakeNode = document.createElement('react');
          var invokeGuardedCallbackDev = function(name, func, context, a, b, c, d, e, f) {
            var didError = true;
            var funcArgs = Array.prototype.slice.call(arguments, 3);
            function callCallback() {
              fakeNode.removeEventListener(evtType, callCallback, false);
              func.apply(context, funcArgs);
              didError = false;
            }
            var error = void 0;
            var didSetError = false;
            var isCrossOriginError = false;
            function onError(event) {
              error = event.error;
              didSetError = true;
              if (error === null && event.colno === 0 && event.lineno === 0) {
                isCrossOriginError = true;
              }
            }
            var evtType = 'react-' + (name ? name : 'invokeguardedcallback');
            window.addEventListener('error', onError);
            fakeNode.addEventListener(evtType, callCallback, false);
            var evt = document.createEvent('Event');
            evt.initEvent(evtType, false, false);
            fakeNode.dispatchEvent(evt);
            if (didError) {
              if (!didSetError) {
                error = new Error('An error was thrown inside one of your components, but React ' + "doesn't know what it was. This is likely due to browser " + 'flakiness. React does its best to preserve the "Pause on ' + 'exceptions" behavior of the DevTools, which requires some ' + "DEV-mode only tricks. It's possible that these don't work in " + 'your browser. Try triggering the error in production mode, ' + 'or switching to a modern browser. If you suspect that this is ' + 'actually an issue with React, please file an issue.');
              } else if (isCrossOriginError) {
                error = new Error("A cross-origin error was thrown. React doesn't have access to " + 'the actual error object in development. ' + 'See https://fb.me/react-crossorigin-error for more information.');
              }
              ReactErrorUtils._hasCaughtError = true;
              ReactErrorUtils._caughtError = error;
            } else {
              ReactErrorUtils._hasCaughtError = false;
              ReactErrorUtils._caughtError = null;
            }
            window.removeEventListener('error', onError);
          };
          invokeGuardedCallback = invokeGuardedCallbackDev;
        }
      }
      var rethrowCaughtError = function() {
        if (ReactErrorUtils._hasRethrowError) {
          var error = ReactErrorUtils._rethrowError;
          ReactErrorUtils._rethrowError = null;
          ReactErrorUtils._hasRethrowError = false;
          throw error;
        }
      };
      var eventPluginOrder = null;
      var namesToPlugins = {};
      function recomputePluginOrdering() {
        if (!eventPluginOrder) {
          return;
        }
        for (var pluginName in namesToPlugins) {
          var pluginModule = namesToPlugins[pluginName];
          var pluginIndex = eventPluginOrder.indexOf(pluginName);
          !(pluginIndex > -1) ? invariant(false, 'EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `%s`.', pluginName) : void 0;
          if (plugins[pluginIndex]) {
            continue;
          }
          !pluginModule.extractEvents ? invariant(false, 'EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `%s` does not.', pluginName) : void 0;
          plugins[pluginIndex] = pluginModule;
          var publishedEvents = pluginModule.eventTypes;
          for (var eventName in publishedEvents) {
            !publishEventForPlugin(publishedEvents[eventName], pluginModule, eventName) ? invariant(false, 'EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.', eventName, pluginName) : void 0;
          }
        }
      }
      function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
        !!eventNameDispatchConfigs.hasOwnProperty(eventName) ? invariant(false, 'EventPluginHub: More than one plugin attempted to publish the same event name, `%s`.', eventName) : void 0;
        eventNameDispatchConfigs[eventName] = dispatchConfig;
        var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
        if (phasedRegistrationNames) {
          for (var phaseName in phasedRegistrationNames) {
            if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
              var phasedRegistrationName = phasedRegistrationNames[phaseName];
              publishRegistrationName(phasedRegistrationName, pluginModule, eventName);
            }
          }
          return true;
        } else if (dispatchConfig.registrationName) {
          publishRegistrationName(dispatchConfig.registrationName, pluginModule, eventName);
          return true;
        }
        return false;
      }
      function publishRegistrationName(registrationName, pluginModule, eventName) {
        !!registrationNameModules[registrationName] ? invariant(false, 'EventPluginHub: More than one plugin attempted to publish the same registration name, `%s`.', registrationName) : void 0;
        registrationNameModules[registrationName] = pluginModule;
        registrationNameDependencies[registrationName] = pluginModule.eventTypes[eventName].dependencies;
        {
          var lowerCasedName = registrationName.toLowerCase();
          possibleRegistrationNames[lowerCasedName] = registrationName;
          if (registrationName === 'onDoubleClick') {
            possibleRegistrationNames.ondblclick = registrationName;
          }
        }
      }
      var plugins = [];
      var eventNameDispatchConfigs = {};
      var registrationNameModules = {};
      var registrationNameDependencies = {};
      var possibleRegistrationNames = {};
      function injectEventPluginOrder(injectedEventPluginOrder) {
        !!eventPluginOrder ? invariant(false, 'EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React.') : void 0;
        eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
        recomputePluginOrdering();
      }
      function injectEventPluginsByName(injectedNamesToPlugins) {
        var isOrderingDirty = false;
        for (var pluginName in injectedNamesToPlugins) {
          if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
            continue;
          }
          var pluginModule = injectedNamesToPlugins[pluginName];
          if (!namesToPlugins.hasOwnProperty(pluginName) || namesToPlugins[pluginName] !== pluginModule) {
            !!namesToPlugins[pluginName] ? invariant(false, 'EventPluginRegistry: Cannot inject two different event plugins using the same name, `%s`.', pluginName) : void 0;
            namesToPlugins[pluginName] = pluginModule;
            isOrderingDirty = true;
          }
        }
        if (isOrderingDirty) {
          recomputePluginOrdering();
        }
      }
      var EventPluginRegistry = Object.freeze({
        plugins: plugins,
        eventNameDispatchConfigs: eventNameDispatchConfigs,
        registrationNameModules: registrationNameModules,
        registrationNameDependencies: registrationNameDependencies,
        possibleRegistrationNames: possibleRegistrationNames,
        injectEventPluginOrder: injectEventPluginOrder,
        injectEventPluginsByName: injectEventPluginsByName
      });
      var getFiberCurrentPropsFromNode = null;
      var getInstanceFromNode = null;
      var getNodeFromInstance = null;
      var injection$2 = {injectComponentTree: function(Injected) {
          getFiberCurrentPropsFromNode = Injected.getFiberCurrentPropsFromNode;
          getInstanceFromNode = Injected.getInstanceFromNode;
          getNodeFromInstance = Injected.getNodeFromInstance;
          {
            warning(getNodeFromInstance && getInstanceFromNode, 'EventPluginUtils.injection.injectComponentTree(...): Injected ' + 'module is missing getNodeFromInstance or getInstanceFromNode.');
          }
        }};
      var validateEventDispatches;
      {
        validateEventDispatches = function(event) {
          var dispatchListeners = event._dispatchListeners;
          var dispatchInstances = event._dispatchInstances;
          var listenersIsArr = Array.isArray(dispatchListeners);
          var listenersLen = listenersIsArr ? dispatchListeners.length : dispatchListeners ? 1 : 0;
          var instancesIsArr = Array.isArray(dispatchInstances);
          var instancesLen = instancesIsArr ? dispatchInstances.length : dispatchInstances ? 1 : 0;
          warning(instancesIsArr === listenersIsArr && instancesLen === listenersLen, 'EventPluginUtils: Invalid `event`.');
        };
      }
      function executeDispatch(event, simulated, listener, inst) {
        var type = event.type || 'unknown-event';
        event.currentTarget = getNodeFromInstance(inst);
        ReactErrorUtils.invokeGuardedCallbackAndCatchFirstError(type, listener, undefined, event);
        event.currentTarget = null;
      }
      function executeDispatchesInOrder(event, simulated) {
        var dispatchListeners = event._dispatchListeners;
        var dispatchInstances = event._dispatchInstances;
        {
          validateEventDispatches(event);
        }
        if (Array.isArray(dispatchListeners)) {
          for (var i = 0; i < dispatchListeners.length; i++) {
            if (event.isPropagationStopped()) {
              break;
            }
            executeDispatch(event, simulated, dispatchListeners[i], dispatchInstances[i]);
          }
        } else if (dispatchListeners) {
          executeDispatch(event, simulated, dispatchListeners, dispatchInstances);
        }
        event._dispatchListeners = null;
        event._dispatchInstances = null;
      }
      function accumulateInto(current, next) {
        !(next != null) ? invariant(false, 'accumulateInto(...): Accumulated items must not be null or undefined.') : void 0;
        if (current == null) {
          return next;
        }
        if (Array.isArray(current)) {
          if (Array.isArray(next)) {
            current.push.apply(current, next);
            return current;
          }
          current.push(next);
          return current;
        }
        if (Array.isArray(next)) {
          return [current].concat(next);
        }
        return [current, next];
      }
      function forEachAccumulated(arr, cb, scope) {
        if (Array.isArray(arr)) {
          arr.forEach(cb, scope);
        } else if (arr) {
          cb.call(scope, arr);
        }
      }
      var eventQueue = null;
      var executeDispatchesAndRelease = function(event, simulated) {
        if (event) {
          executeDispatchesInOrder(event, simulated);
          if (!event.isPersistent()) {
            event.constructor.release(event);
          }
        }
      };
      var executeDispatchesAndReleaseSimulated = function(e) {
        return executeDispatchesAndRelease(e, true);
      };
      var executeDispatchesAndReleaseTopLevel = function(e) {
        return executeDispatchesAndRelease(e, false);
      };
      function isInteractive(tag) {
        return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
      }
      function shouldPreventMouseEvent(name, type, props) {
        switch (name) {
          case 'onClick':
          case 'onClickCapture':
          case 'onDoubleClick':
          case 'onDoubleClickCapture':
          case 'onMouseDown':
          case 'onMouseDownCapture':
          case 'onMouseMove':
          case 'onMouseMoveCapture':
          case 'onMouseUp':
          case 'onMouseUpCapture':
            return !!(props.disabled && isInteractive(type));
          default:
            return false;
        }
      }
      var injection$1 = {
        injectEventPluginOrder: injectEventPluginOrder,
        injectEventPluginsByName: injectEventPluginsByName
      };
      function getListener(inst, registrationName) {
        var listener;
        var stateNode = inst.stateNode;
        if (!stateNode) {
          return null;
        }
        var props = getFiberCurrentPropsFromNode(stateNode);
        if (!props) {
          return null;
        }
        listener = props[registrationName];
        if (shouldPreventMouseEvent(registrationName, inst.type, props)) {
          return null;
        }
        !(!listener || typeof listener === 'function') ? invariant(false, 'Expected `%s` listener to be a function, instead got a value of `%s` type.', registrationName, typeof listener) : void 0;
        return listener;
      }
      function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var events;
        for (var i = 0; i < plugins.length; i++) {
          var possiblePlugin = plugins[i];
          if (possiblePlugin) {
            var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
            if (extractedEvents) {
              events = accumulateInto(events, extractedEvents);
            }
          }
        }
        return events;
      }
      function enqueueEvents(events) {
        if (events) {
          eventQueue = accumulateInto(eventQueue, events);
        }
      }
      function processEventQueue(simulated) {
        var processingEventQueue = eventQueue;
        eventQueue = null;
        if (simulated) {
          forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseSimulated);
        } else {
          forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);
        }
        !!eventQueue ? invariant(false, 'processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented.') : void 0;
        ReactErrorUtils.rethrowCaughtError();
      }
      var EventPluginHub = Object.freeze({
        injection: injection$1,
        getListener: getListener,
        extractEvents: extractEvents,
        enqueueEvents: enqueueEvents,
        processEventQueue: processEventQueue
      });
      var IndeterminateComponent = 0;
      var FunctionalComponent = 1;
      var ClassComponent = 2;
      var HostRoot = 3;
      var HostPortal = 4;
      var HostComponent = 5;
      var HostText = 6;
      var CallComponent = 7;
      var CallHandlerPhase = 8;
      var ReturnComponent = 9;
      var Fragment = 10;
      var randomKey = Math.random().toString(36).slice(2);
      var internalInstanceKey = '__reactInternalInstance$' + randomKey;
      var internalEventHandlersKey = '__reactEventHandlers$' + randomKey;
      function precacheFiberNode$1(hostInst, node) {
        node[internalInstanceKey] = hostInst;
      }
      function getClosestInstanceFromNode(node) {
        if (node[internalInstanceKey]) {
          return node[internalInstanceKey];
        }
        var parents = [];
        while (!node[internalInstanceKey]) {
          parents.push(node);
          if (node.parentNode) {
            node = node.parentNode;
          } else {
            return null;
          }
        }
        var closest = void 0;
        var inst = node[internalInstanceKey];
        if (inst.tag === HostComponent || inst.tag === HostText) {
          return inst;
        }
        for (; node && (inst = node[internalInstanceKey]); node = parents.pop()) {
          closest = inst;
        }
        return closest;
      }
      function getInstanceFromNode$1(node) {
        var inst = node[internalInstanceKey];
        if (inst) {
          if (inst.tag === HostComponent || inst.tag === HostText) {
            return inst;
          } else {
            return null;
          }
        }
        return null;
      }
      function getNodeFromInstance$1(inst) {
        if (inst.tag === HostComponent || inst.tag === HostText) {
          return inst.stateNode;
        }
        invariant(false, 'getNodeFromInstance: Invalid argument.');
      }
      function getFiberCurrentPropsFromNode$1(node) {
        return node[internalEventHandlersKey] || null;
      }
      function updateFiberProps$1(node, props) {
        node[internalEventHandlersKey] = props;
      }
      var ReactDOMComponentTree = Object.freeze({
        precacheFiberNode: precacheFiberNode$1,
        getClosestInstanceFromNode: getClosestInstanceFromNode,
        getInstanceFromNode: getInstanceFromNode$1,
        getNodeFromInstance: getNodeFromInstance$1,
        getFiberCurrentPropsFromNode: getFiberCurrentPropsFromNode$1,
        updateFiberProps: updateFiberProps$1
      });
      function getParent(inst) {
        do {
          inst = inst['return'];
        } while (inst && inst.tag !== HostComponent);
        if (inst) {
          return inst;
        }
        return null;
      }
      function getLowestCommonAncestor(instA, instB) {
        var depthA = 0;
        for (var tempA = instA; tempA; tempA = getParent(tempA)) {
          depthA++;
        }
        var depthB = 0;
        for (var tempB = instB; tempB; tempB = getParent(tempB)) {
          depthB++;
        }
        while (depthA - depthB > 0) {
          instA = getParent(instA);
          depthA--;
        }
        while (depthB - depthA > 0) {
          instB = getParent(instB);
          depthB--;
        }
        var depth = depthA;
        while (depth--) {
          if (instA === instB || instA === instB.alternate) {
            return instA;
          }
          instA = getParent(instA);
          instB = getParent(instB);
        }
        return null;
      }
      function getParentInstance(inst) {
        return getParent(inst);
      }
      function traverseTwoPhase(inst, fn, arg) {
        var path = [];
        while (inst) {
          path.push(inst);
          inst = getParent(inst);
        }
        var i;
        for (i = path.length; i-- > 0; ) {
          fn(path[i], 'captured', arg);
        }
        for (i = 0; i < path.length; i++) {
          fn(path[i], 'bubbled', arg);
        }
      }
      function traverseEnterLeave(from, to, fn, argFrom, argTo) {
        var common = from && to ? getLowestCommonAncestor(from, to) : null;
        var pathFrom = [];
        while (true) {
          if (!from) {
            break;
          }
          if (from === common) {
            break;
          }
          var alternate = from.alternate;
          if (alternate !== null && alternate === common) {
            break;
          }
          pathFrom.push(from);
          from = getParent(from);
        }
        var pathTo = [];
        while (true) {
          if (!to) {
            break;
          }
          if (to === common) {
            break;
          }
          var _alternate = to.alternate;
          if (_alternate !== null && _alternate === common) {
            break;
          }
          pathTo.push(to);
          to = getParent(to);
        }
        for (var i = 0; i < pathFrom.length; i++) {
          fn(pathFrom[i], 'bubbled', argFrom);
        }
        for (var _i = pathTo.length; _i-- > 0; ) {
          fn(pathTo[_i], 'captured', argTo);
        }
      }
      function listenerAtPhase(inst, event, propagationPhase) {
        var registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase];
        return getListener(inst, registrationName);
      }
      function accumulateDirectionalDispatches(inst, phase, event) {
        {
          warning(inst, 'Dispatching inst must not be null');
        }
        var listener = listenerAtPhase(inst, event, phase);
        if (listener) {
          event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
          event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
        }
      }
      function accumulateTwoPhaseDispatchesSingle(event) {
        if (event && event.dispatchConfig.phasedRegistrationNames) {
          traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
        }
      }
      function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
        if (event && event.dispatchConfig.phasedRegistrationNames) {
          var targetInst = event._targetInst;
          var parentInst = targetInst ? getParentInstance(targetInst) : null;
          traverseTwoPhase(parentInst, accumulateDirectionalDispatches, event);
        }
      }
      function accumulateDispatches(inst, ignoredDirection, event) {
        if (inst && event && event.dispatchConfig.registrationName) {
          var registrationName = event.dispatchConfig.registrationName;
          var listener = getListener(inst, registrationName);
          if (listener) {
            event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
            event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
          }
        }
      }
      function accumulateDirectDispatchesSingle(event) {
        if (event && event.dispatchConfig.registrationName) {
          accumulateDispatches(event._targetInst, null, event);
        }
      }
      function accumulateTwoPhaseDispatches(events) {
        forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
      }
      function accumulateTwoPhaseDispatchesSkipTarget(events) {
        forEachAccumulated(events, accumulateTwoPhaseDispatchesSingleSkipTarget);
      }
      function accumulateEnterLeaveDispatches(leave, enter, from, to) {
        traverseEnterLeave(from, to, accumulateDispatches, leave, enter);
      }
      function accumulateDirectDispatches(events) {
        forEachAccumulated(events, accumulateDirectDispatchesSingle);
      }
      var EventPropagators = Object.freeze({
        accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
        accumulateTwoPhaseDispatchesSkipTarget: accumulateTwoPhaseDispatchesSkipTarget,
        accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches,
        accumulateDirectDispatches: accumulateDirectDispatches
      });
      var contentKey = null;
      function getTextContentAccessor() {
        if (!contentKey && ExecutionEnvironment.canUseDOM) {
          contentKey = 'textContent' in document.documentElement ? 'textContent' : 'innerText';
        }
        return contentKey;
      }
      var compositionState = {
        _root: null,
        _startText: null,
        _fallbackText: null
      };
      function initialize(nativeEventTarget) {
        compositionState._root = nativeEventTarget;
        compositionState._startText = getText();
        return true;
      }
      function reset() {
        compositionState._root = null;
        compositionState._startText = null;
        compositionState._fallbackText = null;
      }
      function getData() {
        if (compositionState._fallbackText) {
          return compositionState._fallbackText;
        }
        var start;
        var startValue = compositionState._startText;
        var startLength = startValue.length;
        var end;
        var endValue = getText();
        var endLength = endValue.length;
        for (start = 0; start < startLength; start++) {
          if (startValue[start] !== endValue[start]) {
            break;
          }
        }
        var minEnd = startLength - start;
        for (end = 1; end <= minEnd; end++) {
          if (startValue[startLength - end] !== endValue[endLength - end]) {
            break;
          }
        }
        var sliceTail = end > 1 ? 1 - end : undefined;
        compositionState._fallbackText = endValue.slice(start, sliceTail);
        return compositionState._fallbackText;
      }
      function getText() {
        if ('value' in compositionState._root) {
          return compositionState._root.value;
        }
        return compositionState._root[getTextContentAccessor()];
      }
      var didWarnForAddedNewProperty = false;
      var isProxySupported = typeof Proxy === 'function';
      var EVENT_POOL_SIZE = 10;
      var shouldBeReleasedProperties = ['dispatchConfig', '_targetInst', 'nativeEvent', 'isDefaultPrevented', 'isPropagationStopped', '_dispatchListeners', '_dispatchInstances'];
      var EventInterface = {
        type: null,
        target: null,
        currentTarget: emptyFunction$1.thatReturnsNull,
        eventPhase: null,
        bubbles: null,
        cancelable: null,
        timeStamp: function(event) {
          return event.timeStamp || Date.now();
        },
        defaultPrevented: null,
        isTrusted: null
      };
      function SyntheticEvent(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
        {
          delete this.nativeEvent;
          delete this.preventDefault;
          delete this.stopPropagation;
        }
        this.dispatchConfig = dispatchConfig;
        this._targetInst = targetInst;
        this.nativeEvent = nativeEvent;
        var Interface = this.constructor.Interface;
        for (var propName in Interface) {
          if (!Interface.hasOwnProperty(propName)) {
            continue;
          }
          {
            delete this[propName];
          }
          var normalize = Interface[propName];
          if (normalize) {
            this[propName] = normalize(nativeEvent);
          } else {
            if (propName === 'target') {
              this.target = nativeEventTarget;
            } else {
              this[propName] = nativeEvent[propName];
            }
          }
        }
        var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
        if (defaultPrevented) {
          this.isDefaultPrevented = emptyFunction$1.thatReturnsTrue;
        } else {
          this.isDefaultPrevented = emptyFunction$1.thatReturnsFalse;
        }
        this.isPropagationStopped = emptyFunction$1.thatReturnsFalse;
        return this;
      }
      _assign(SyntheticEvent.prototype, {
        preventDefault: function() {
          this.defaultPrevented = true;
          var event = this.nativeEvent;
          if (!event) {
            return;
          }
          if (event.preventDefault) {
            event.preventDefault();
          } else if (typeof event.returnValue !== 'unknown') {
            event.returnValue = false;
          }
          this.isDefaultPrevented = emptyFunction$1.thatReturnsTrue;
        },
        stopPropagation: function() {
          var event = this.nativeEvent;
          if (!event) {
            return;
          }
          if (event.stopPropagation) {
            event.stopPropagation();
          } else if (typeof event.cancelBubble !== 'unknown') {
            event.cancelBubble = true;
          }
          this.isPropagationStopped = emptyFunction$1.thatReturnsTrue;
        },
        persist: function() {
          this.isPersistent = emptyFunction$1.thatReturnsTrue;
        },
        isPersistent: emptyFunction$1.thatReturnsFalse,
        destructor: function() {
          var Interface = this.constructor.Interface;
          for (var propName in Interface) {
            {
              Object.defineProperty(this, propName, getPooledWarningPropertyDefinition(propName, Interface[propName]));
            }
          }
          for (var i = 0; i < shouldBeReleasedProperties.length; i++) {
            this[shouldBeReleasedProperties[i]] = null;
          }
          {
            Object.defineProperty(this, 'nativeEvent', getPooledWarningPropertyDefinition('nativeEvent', null));
            Object.defineProperty(this, 'preventDefault', getPooledWarningPropertyDefinition('preventDefault', emptyFunction$1));
            Object.defineProperty(this, 'stopPropagation', getPooledWarningPropertyDefinition('stopPropagation', emptyFunction$1));
          }
        }
      });
      SyntheticEvent.Interface = EventInterface;
      SyntheticEvent.augmentClass = function(Class, Interface) {
        var Super = this;
        var E = function() {};
        E.prototype = Super.prototype;
        var prototype = new E();
        _assign(prototype, Class.prototype);
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.Interface = _assign({}, Super.Interface, Interface);
        Class.augmentClass = Super.augmentClass;
        addEventPoolingTo(Class);
      };
      {
        if (isProxySupported) {
          SyntheticEvent = new Proxy(SyntheticEvent, {
            construct: function(target, args) {
              return this.apply(target, Object.create(target.prototype), args);
            },
            apply: function(constructor, that, args) {
              return new Proxy(constructor.apply(that, args), {set: function(target, prop, value) {
                  if (prop !== 'isPersistent' && !target.constructor.Interface.hasOwnProperty(prop) && shouldBeReleasedProperties.indexOf(prop) === -1) {
                    warning(didWarnForAddedNewProperty || target.isPersistent(), "This synthetic event is reused for performance reasons. If you're " + "seeing this, you're adding a new property in the synthetic event object. " + 'The property is never released. See ' + 'https://fb.me/react-event-pooling for more information.');
                    didWarnForAddedNewProperty = true;
                  }
                  target[prop] = value;
                  return true;
                }});
            }
          });
        }
      }
      addEventPoolingTo(SyntheticEvent);
      function getPooledWarningPropertyDefinition(propName, getVal) {
        var isFunction = typeof getVal === 'function';
        return {
          configurable: true,
          set: set,
          get: get
        };
        function set(val) {
          var action = isFunction ? 'setting the method' : 'setting the property';
          warn(action, 'This is effectively a no-op');
          return val;
        }
        function get() {
          var action = isFunction ? 'accessing the method' : 'accessing the property';
          var result = isFunction ? 'This is a no-op function' : 'This is set to null';
          warn(action, result);
          return getVal;
        }
        function warn(action, result) {
          var warningCondition = false;
          warning(warningCondition, "This synthetic event is reused for performance reasons. If you're seeing this, " + "you're %s `%s` on a released/nullified synthetic event. %s. " + 'If you must keep the original synthetic event around, use event.persist(). ' + 'See https://fb.me/react-event-pooling for more information.', action, propName, result);
        }
      }
      function getPooledEvent(dispatchConfig, targetInst, nativeEvent, nativeInst) {
        var EventConstructor = this;
        if (EventConstructor.eventPool.length) {
          var instance = EventConstructor.eventPool.pop();
          EventConstructor.call(instance, dispatchConfig, targetInst, nativeEvent, nativeInst);
          return instance;
        }
        return new EventConstructor(dispatchConfig, targetInst, nativeEvent, nativeInst);
      }
      function releasePooledEvent(event) {
        var EventConstructor = this;
        !(event instanceof EventConstructor) ? invariant(false, 'Trying to release an event instance  into a pool of a different type.') : void 0;
        event.destructor();
        if (EventConstructor.eventPool.length < EVENT_POOL_SIZE) {
          EventConstructor.eventPool.push(event);
        }
      }
      function addEventPoolingTo(EventConstructor) {
        EventConstructor.eventPool = [];
        EventConstructor.getPooled = getPooledEvent;
        EventConstructor.release = releasePooledEvent;
      }
      var SyntheticEvent$1 = SyntheticEvent;
      var CompositionEventInterface = {data: null};
      function SyntheticCompositionEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticEvent$1.augmentClass(SyntheticCompositionEvent, CompositionEventInterface);
      var InputEventInterface = {data: null};
      function SyntheticInputEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticEvent$1.augmentClass(SyntheticInputEvent, InputEventInterface);
      var END_KEYCODES = [9, 13, 27, 32];
      var START_KEYCODE = 229;
      var canUseCompositionEvent = ExecutionEnvironment.canUseDOM && 'CompositionEvent' in window;
      var documentMode = null;
      if (ExecutionEnvironment.canUseDOM && 'documentMode' in document) {
        documentMode = document.documentMode;
      }
      var canUseTextInputEvent = ExecutionEnvironment.canUseDOM && 'TextEvent' in window && !documentMode && !isPresto();
      var useFallbackCompositionData = ExecutionEnvironment.canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);
      function isPresto() {
        var opera = window.opera;
        return typeof opera === 'object' && typeof opera.version === 'function' && parseInt(opera.version(), 10) <= 12;
      }
      var SPACEBAR_CODE = 32;
      var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);
      var eventTypes = {
        beforeInput: {
          phasedRegistrationNames: {
            bubbled: 'onBeforeInput',
            captured: 'onBeforeInputCapture'
          },
          dependencies: ['topCompositionEnd', 'topKeyPress', 'topTextInput', 'topPaste']
        },
        compositionEnd: {
          phasedRegistrationNames: {
            bubbled: 'onCompositionEnd',
            captured: 'onCompositionEndCapture'
          },
          dependencies: ['topBlur', 'topCompositionEnd', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
        },
        compositionStart: {
          phasedRegistrationNames: {
            bubbled: 'onCompositionStart',
            captured: 'onCompositionStartCapture'
          },
          dependencies: ['topBlur', 'topCompositionStart', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
        },
        compositionUpdate: {
          phasedRegistrationNames: {
            bubbled: 'onCompositionUpdate',
            captured: 'onCompositionUpdateCapture'
          },
          dependencies: ['topBlur', 'topCompositionUpdate', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
        }
      };
      var hasSpaceKeypress = false;
      function isKeypressCommand(nativeEvent) {
        return (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) && !(nativeEvent.ctrlKey && nativeEvent.altKey);
      }
      function getCompositionEventType(topLevelType) {
        switch (topLevelType) {
          case 'topCompositionStart':
            return eventTypes.compositionStart;
          case 'topCompositionEnd':
            return eventTypes.compositionEnd;
          case 'topCompositionUpdate':
            return eventTypes.compositionUpdate;
        }
      }
      function isFallbackCompositionStart(topLevelType, nativeEvent) {
        return topLevelType === 'topKeyDown' && nativeEvent.keyCode === START_KEYCODE;
      }
      function isFallbackCompositionEnd(topLevelType, nativeEvent) {
        switch (topLevelType) {
          case 'topKeyUp':
            return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;
          case 'topKeyDown':
            return nativeEvent.keyCode !== START_KEYCODE;
          case 'topKeyPress':
          case 'topMouseDown':
          case 'topBlur':
            return true;
          default:
            return false;
        }
      }
      function getDataFromCustomEvent(nativeEvent) {
        var detail = nativeEvent.detail;
        if (typeof detail === 'object' && 'data' in detail) {
          return detail.data;
        }
        return null;
      }
      var isComposing = false;
      function extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var eventType;
        var fallbackData;
        if (canUseCompositionEvent) {
          eventType = getCompositionEventType(topLevelType);
        } else if (!isComposing) {
          if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
            eventType = eventTypes.compositionStart;
          }
        } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
          eventType = eventTypes.compositionEnd;
        }
        if (!eventType) {
          return null;
        }
        if (useFallbackCompositionData) {
          if (!isComposing && eventType === eventTypes.compositionStart) {
            isComposing = initialize(nativeEventTarget);
          } else if (eventType === eventTypes.compositionEnd) {
            if (isComposing) {
              fallbackData = getData();
            }
          }
        }
        var event = SyntheticCompositionEvent.getPooled(eventType, targetInst, nativeEvent, nativeEventTarget);
        if (fallbackData) {
          event.data = fallbackData;
        } else {
          var customData = getDataFromCustomEvent(nativeEvent);
          if (customData !== null) {
            event.data = customData;
          }
        }
        accumulateTwoPhaseDispatches(event);
        return event;
      }
      function getNativeBeforeInputChars(topLevelType, nativeEvent) {
        switch (topLevelType) {
          case 'topCompositionEnd':
            return getDataFromCustomEvent(nativeEvent);
          case 'topKeyPress':
            var which = nativeEvent.which;
            if (which !== SPACEBAR_CODE) {
              return null;
            }
            hasSpaceKeypress = true;
            return SPACEBAR_CHAR;
          case 'topTextInput':
            var chars = nativeEvent.data;
            if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
              return null;
            }
            return chars;
          default:
            return null;
        }
      }
      function getFallbackBeforeInputChars(topLevelType, nativeEvent) {
        if (isComposing) {
          if (topLevelType === 'topCompositionEnd' || !canUseCompositionEvent && isFallbackCompositionEnd(topLevelType, nativeEvent)) {
            var chars = getData();
            reset();
            isComposing = false;
            return chars;
          }
          return null;
        }
        switch (topLevelType) {
          case 'topPaste':
            return null;
          case 'topKeyPress':
            if (!isKeypressCommand(nativeEvent)) {
              if (nativeEvent.char && nativeEvent.char.length > 1) {
                return nativeEvent.char;
              } else if (nativeEvent.which) {
                return String.fromCharCode(nativeEvent.which);
              }
            }
            return null;
          case 'topCompositionEnd':
            return useFallbackCompositionData ? null : nativeEvent.data;
          default:
            return null;
        }
      }
      function extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var chars;
        if (canUseTextInputEvent) {
          chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
        } else {
          chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
        }
        if (!chars) {
          return null;
        }
        var event = SyntheticInputEvent.getPooled(eventTypes.beforeInput, targetInst, nativeEvent, nativeEventTarget);
        event.data = chars;
        accumulateTwoPhaseDispatches(event);
        return event;
      }
      var BeforeInputEventPlugin = {
        eventTypes: eventTypes,
        extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
          return [extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget), extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget)];
        }
      };
      var fiberHostComponent = null;
      var ReactControlledComponentInjection = {injectFiberControlledHostComponent: function(hostComponentImpl) {
          fiberHostComponent = hostComponentImpl;
        }};
      var restoreTarget = null;
      var restoreQueue = null;
      function restoreStateOfTarget(target) {
        var internalInstance = getInstanceFromNode(target);
        if (!internalInstance) {
          return;
        }
        !(fiberHostComponent && typeof fiberHostComponent.restoreControlledState === 'function') ? invariant(false, 'Fiber needs to be injected to handle a fiber target for controlled events. This error is likely caused by a bug in React. Please file an issue.') : void 0;
        var props = getFiberCurrentPropsFromNode(internalInstance.stateNode);
        fiberHostComponent.restoreControlledState(internalInstance.stateNode, internalInstance.type, props);
      }
      var injection$3 = ReactControlledComponentInjection;
      function enqueueStateRestore(target) {
        if (restoreTarget) {
          if (restoreQueue) {
            restoreQueue.push(target);
          } else {
            restoreQueue = [target];
          }
        } else {
          restoreTarget = target;
        }
      }
      function restoreStateIfNeeded() {
        if (!restoreTarget) {
          return;
        }
        var target = restoreTarget;
        var queuedTargets = restoreQueue;
        restoreTarget = null;
        restoreQueue = null;
        restoreStateOfTarget(target);
        if (queuedTargets) {
          for (var i = 0; i < queuedTargets.length; i++) {
            restoreStateOfTarget(queuedTargets[i]);
          }
        }
      }
      var ReactControlledComponent = Object.freeze({
        injection: injection$3,
        enqueueStateRestore: enqueueStateRestore,
        restoreStateIfNeeded: restoreStateIfNeeded
      });
      var fiberBatchedUpdates = function(fn, bookkeeping) {
        return fn(bookkeeping);
      };
      var isNestingBatched = false;
      function batchedUpdates(fn, bookkeeping) {
        if (isNestingBatched) {
          return fiberBatchedUpdates(fn, bookkeeping);
        }
        isNestingBatched = true;
        try {
          return fiberBatchedUpdates(fn, bookkeeping);
        } finally {
          isNestingBatched = false;
          restoreStateIfNeeded();
        }
      }
      var ReactGenericBatchingInjection = {injectFiberBatchedUpdates: function(_batchedUpdates) {
          fiberBatchedUpdates = _batchedUpdates;
        }};
      var injection$4 = ReactGenericBatchingInjection;
      var supportedInputTypes = {
        color: true,
        date: true,
        datetime: true,
        'datetime-local': true,
        email: true,
        month: true,
        number: true,
        password: true,
        range: true,
        search: true,
        tel: true,
        text: true,
        time: true,
        url: true,
        week: true
      };
      function isTextInputElement(elem) {
        var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
        if (nodeName === 'input') {
          return !!supportedInputTypes[elem.type];
        }
        if (nodeName === 'textarea') {
          return true;
        }
        return false;
      }
      var ELEMENT_NODE = 1;
      var TEXT_NODE = 3;
      var COMMENT_NODE = 8;
      var DOCUMENT_NODE = 9;
      var DOCUMENT_FRAGMENT_NODE = 11;
      function getEventTarget(nativeEvent) {
        var target = nativeEvent.target || nativeEvent.srcElement || window;
        if (target.correspondingUseElement) {
          target = target.correspondingUseElement;
        }
        return target.nodeType === TEXT_NODE ? target.parentNode : target;
      }
      var useHasFeature;
      if (ExecutionEnvironment.canUseDOM) {
        useHasFeature = document.implementation && document.implementation.hasFeature && document.implementation.hasFeature('', '') !== true;
      }
      function isEventSupported(eventNameSuffix, capture) {
        if (!ExecutionEnvironment.canUseDOM || capture && !('addEventListener' in document)) {
          return false;
        }
        var eventName = 'on' + eventNameSuffix;
        var isSupported = eventName in document;
        if (!isSupported) {
          var element = document.createElement('div');
          element.setAttribute(eventName, 'return;');
          isSupported = typeof element[eventName] === 'function';
        }
        if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
          isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
        }
        return isSupported;
      }
      function isCheckable(elem) {
        var type = elem.type;
        var nodeName = elem.nodeName;
        return nodeName && nodeName.toLowerCase() === 'input' && (type === 'checkbox' || type === 'radio');
      }
      function getTracker(node) {
        return node._valueTracker;
      }
      function detachTracker(node) {
        node._valueTracker = null;
      }
      function getValueFromNode(node) {
        var value = '';
        if (!node) {
          return value;
        }
        if (isCheckable(node)) {
          value = node.checked ? 'true' : 'false';
        } else {
          value = node.value;
        }
        return value;
      }
      function trackValueOnNode(node) {
        var valueField = isCheckable(node) ? 'checked' : 'value';
        var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);
        var currentValue = '' + node[valueField];
        if (node.hasOwnProperty(valueField) || typeof descriptor.get !== 'function' || typeof descriptor.set !== 'function') {
          return;
        }
        Object.defineProperty(node, valueField, {
          enumerable: descriptor.enumerable,
          configurable: true,
          get: function() {
            return descriptor.get.call(this);
          },
          set: function(value) {
            currentValue = '' + value;
            descriptor.set.call(this, value);
          }
        });
        var tracker = {
          getValue: function() {
            return currentValue;
          },
          setValue: function(value) {
            currentValue = '' + value;
          },
          stopTracking: function() {
            detachTracker(node);
            delete node[valueField];
          }
        };
        return tracker;
      }
      function track(node) {
        if (getTracker(node)) {
          return;
        }
        node._valueTracker = trackValueOnNode(node);
      }
      function updateValueIfChanged(node) {
        if (!node) {
          return false;
        }
        var tracker = getTracker(node);
        if (!tracker) {
          return true;
        }
        var lastValue = tracker.getValue();
        var nextValue = getValueFromNode(node);
        if (nextValue !== lastValue) {
          tracker.setValue(nextValue);
          return true;
        }
        return false;
      }
      var eventTypes$1 = {change: {
          phasedRegistrationNames: {
            bubbled: 'onChange',
            captured: 'onChangeCapture'
          },
          dependencies: ['topBlur', 'topChange', 'topClick', 'topFocus', 'topInput', 'topKeyDown', 'topKeyUp', 'topSelectionChange']
        }};
      function createAndAccumulateChangeEvent(inst, nativeEvent, target) {
        var event = SyntheticEvent$1.getPooled(eventTypes$1.change, inst, nativeEvent, target);
        event.type = 'change';
        enqueueStateRestore(target);
        accumulateTwoPhaseDispatches(event);
        return event;
      }
      var activeElement = null;
      var activeElementInst = null;
      function shouldUseChangeEvent(elem) {
        var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
        return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
      }
      function manualDispatchChangeEvent(nativeEvent) {
        var event = createAndAccumulateChangeEvent(activeElementInst, nativeEvent, getEventTarget(nativeEvent));
        batchedUpdates(runEventInBatch, event);
      }
      function runEventInBatch(event) {
        enqueueEvents(event);
        processEventQueue(false);
      }
      function getInstIfValueChanged(targetInst) {
        var targetNode = getNodeFromInstance$1(targetInst);
        if (updateValueIfChanged(targetNode)) {
          return targetInst;
        }
      }
      function getTargetInstForChangeEvent(topLevelType, targetInst) {
        if (topLevelType === 'topChange') {
          return targetInst;
        }
      }
      var isInputEventSupported = false;
      if (ExecutionEnvironment.canUseDOM) {
        isInputEventSupported = isEventSupported('input') && (!document.documentMode || document.documentMode > 9);
      }
      function startWatchingForValueChange(target, targetInst) {
        activeElement = target;
        activeElementInst = targetInst;
        activeElement.attachEvent('onpropertychange', handlePropertyChange);
      }
      function stopWatchingForValueChange() {
        if (!activeElement) {
          return;
        }
        activeElement.detachEvent('onpropertychange', handlePropertyChange);
        activeElement = null;
        activeElementInst = null;
      }
      function handlePropertyChange(nativeEvent) {
        if (nativeEvent.propertyName !== 'value') {
          return;
        }
        if (getInstIfValueChanged(activeElementInst)) {
          manualDispatchChangeEvent(nativeEvent);
        }
      }
      function handleEventsForInputEventPolyfill(topLevelType, target, targetInst) {
        if (topLevelType === 'topFocus') {
          stopWatchingForValueChange();
          startWatchingForValueChange(target, targetInst);
        } else if (topLevelType === 'topBlur') {
          stopWatchingForValueChange();
        }
      }
      function getTargetInstForInputEventPolyfill(topLevelType, targetInst) {
        if (topLevelType === 'topSelectionChange' || topLevelType === 'topKeyUp' || topLevelType === 'topKeyDown') {
          return getInstIfValueChanged(activeElementInst);
        }
      }
      function shouldUseClickEvent(elem) {
        var nodeName = elem.nodeName;
        return nodeName && nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
      }
      function getTargetInstForClickEvent(topLevelType, targetInst) {
        if (topLevelType === 'topClick') {
          return getInstIfValueChanged(targetInst);
        }
      }
      function getTargetInstForInputOrChangeEvent(topLevelType, targetInst) {
        if (topLevelType === 'topInput' || topLevelType === 'topChange') {
          return getInstIfValueChanged(targetInst);
        }
      }
      function handleControlledInputBlur(inst, node) {
        if (inst == null) {
          return;
        }
        var state = inst._wrapperState || node._wrapperState;
        if (!state || !state.controlled || node.type !== 'number') {
          return;
        }
        var value = '' + node.value;
        if (node.getAttribute('value') !== value) {
          node.setAttribute('value', value);
        }
      }
      var ChangeEventPlugin = {
        eventTypes: eventTypes$1,
        _isInputEventSupported: isInputEventSupported,
        extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
          var targetNode = targetInst ? getNodeFromInstance$1(targetInst) : window;
          var getTargetInstFunc,
              handleEventFunc;
          if (shouldUseChangeEvent(targetNode)) {
            getTargetInstFunc = getTargetInstForChangeEvent;
          } else if (isTextInputElement(targetNode)) {
            if (isInputEventSupported) {
              getTargetInstFunc = getTargetInstForInputOrChangeEvent;
            } else {
              getTargetInstFunc = getTargetInstForInputEventPolyfill;
              handleEventFunc = handleEventsForInputEventPolyfill;
            }
          } else if (shouldUseClickEvent(targetNode)) {
            getTargetInstFunc = getTargetInstForClickEvent;
          }
          if (getTargetInstFunc) {
            var inst = getTargetInstFunc(topLevelType, targetInst);
            if (inst) {
              var event = createAndAccumulateChangeEvent(inst, nativeEvent, nativeEventTarget);
              return event;
            }
          }
          if (handleEventFunc) {
            handleEventFunc(topLevelType, targetNode, targetInst);
          }
          if (topLevelType === 'topBlur') {
            handleControlledInputBlur(targetInst, targetNode);
          }
        }
      };
      var DOMEventPluginOrder = ['ResponderEventPlugin', 'SimpleEventPlugin', 'TapEventPlugin', 'EnterLeaveEventPlugin', 'ChangeEventPlugin', 'SelectEventPlugin', 'BeforeInputEventPlugin'];
      var UIEventInterface = {
        view: null,
        detail: null
      };
      function SyntheticUIEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticEvent$1.augmentClass(SyntheticUIEvent, UIEventInterface);
      var modifierKeyToProp = {
        Alt: 'altKey',
        Control: 'ctrlKey',
        Meta: 'metaKey',
        Shift: 'shiftKey'
      };
      function modifierStateGetter(keyArg) {
        var syntheticEvent = this;
        var nativeEvent = syntheticEvent.nativeEvent;
        if (nativeEvent.getModifierState) {
          return nativeEvent.getModifierState(keyArg);
        }
        var keyProp = modifierKeyToProp[keyArg];
        return keyProp ? !!nativeEvent[keyProp] : false;
      }
      function getEventModifierState(nativeEvent) {
        return modifierStateGetter;
      }
      var MouseEventInterface = {
        screenX: null,
        screenY: null,
        clientX: null,
        clientY: null,
        pageX: null,
        pageY: null,
        ctrlKey: null,
        shiftKey: null,
        altKey: null,
        metaKey: null,
        getModifierState: getEventModifierState,
        button: null,
        buttons: null,
        relatedTarget: function(event) {
          return event.relatedTarget || (event.fromElement === event.srcElement ? event.toElement : event.fromElement);
        }
      };
      function SyntheticMouseEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticUIEvent.augmentClass(SyntheticMouseEvent, MouseEventInterface);
      var eventTypes$2 = {
        mouseEnter: {
          registrationName: 'onMouseEnter',
          dependencies: ['topMouseOut', 'topMouseOver']
        },
        mouseLeave: {
          registrationName: 'onMouseLeave',
          dependencies: ['topMouseOut', 'topMouseOver']
        }
      };
      var EnterLeaveEventPlugin = {
        eventTypes: eventTypes$2,
        extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
          if (topLevelType === 'topMouseOver' && (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
            return null;
          }
          if (topLevelType !== 'topMouseOut' && topLevelType !== 'topMouseOver') {
            return null;
          }
          var win;
          if (nativeEventTarget.window === nativeEventTarget) {
            win = nativeEventTarget;
          } else {
            var doc = nativeEventTarget.ownerDocument;
            if (doc) {
              win = doc.defaultView || doc.parentWindow;
            } else {
              win = window;
            }
          }
          var from;
          var to;
          if (topLevelType === 'topMouseOut') {
            from = targetInst;
            var related = nativeEvent.relatedTarget || nativeEvent.toElement;
            to = related ? getClosestInstanceFromNode(related) : null;
          } else {
            from = null;
            to = targetInst;
          }
          if (from === to) {
            return null;
          }
          var fromNode = from == null ? win : getNodeFromInstance$1(from);
          var toNode = to == null ? win : getNodeFromInstance$1(to);
          var leave = SyntheticMouseEvent.getPooled(eventTypes$2.mouseLeave, from, nativeEvent, nativeEventTarget);
          leave.type = 'mouseleave';
          leave.target = fromNode;
          leave.relatedTarget = toNode;
          var enter = SyntheticMouseEvent.getPooled(eventTypes$2.mouseEnter, to, nativeEvent, nativeEventTarget);
          enter.type = 'mouseenter';
          enter.target = toNode;
          enter.relatedTarget = fromNode;
          accumulateEnterLeaveDispatches(leave, enter, from, to);
          return [leave, enter];
        }
      };
      function get(key) {
        return key._reactInternalFiber;
      }
      function has(key) {
        return key._reactInternalFiber !== undefined;
      }
      function set(key, value) {
        key._reactInternalFiber = value;
      }
      var ReactInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      var ReactCurrentOwner = ReactInternals.ReactCurrentOwner;
      var ReactDebugCurrentFrame = ReactInternals.ReactDebugCurrentFrame;
      function getComponentName(fiber) {
        var type = fiber.type;
        if (typeof type === 'string') {
          return type;
        }
        if (typeof type === 'function') {
          return type.displayName || type.name;
        }
        return null;
      }
      var NoEffect = 0;
      var PerformedWork = 1;
      var Placement = 2;
      var Update = 4;
      var PlacementAndUpdate = 6;
      var Deletion = 8;
      var ContentReset = 16;
      var Callback = 32;
      var Err = 64;
      var Ref = 128;
      var MOUNTING = 1;
      var MOUNTED = 2;
      var UNMOUNTED = 3;
      function isFiberMountedImpl(fiber) {
        var node = fiber;
        if (!fiber.alternate) {
          if ((node.effectTag & Placement) !== NoEffect) {
            return MOUNTING;
          }
          while (node['return']) {
            node = node['return'];
            if ((node.effectTag & Placement) !== NoEffect) {
              return MOUNTING;
            }
          }
        } else {
          while (node['return']) {
            node = node['return'];
          }
        }
        if (node.tag === HostRoot) {
          return MOUNTED;
        }
        return UNMOUNTED;
      }
      function isFiberMounted(fiber) {
        return isFiberMountedImpl(fiber) === MOUNTED;
      }
      function isMounted(component) {
        {
          var owner = ReactCurrentOwner.current;
          if (owner !== null && owner.tag === ClassComponent) {
            var ownerFiber = owner;
            var instance = ownerFiber.stateNode;
            warning(instance._warnedAboutRefsInRender, '%s is accessing isMounted inside its render() function. ' + 'render() should be a pure function of props and state. It should ' + 'never access something that requires stale data from the previous ' + 'render, such as refs. Move this logic to componentDidMount and ' + 'componentDidUpdate instead.', getComponentName(ownerFiber) || 'A component');
            instance._warnedAboutRefsInRender = true;
          }
        }
        var fiber = get(component);
        if (!fiber) {
          return false;
        }
        return isFiberMountedImpl(fiber) === MOUNTED;
      }
      function assertIsMounted(fiber) {
        !(isFiberMountedImpl(fiber) === MOUNTED) ? invariant(false, 'Unable to find node on an unmounted component.') : void 0;
      }
      function findCurrentFiberUsingSlowPath(fiber) {
        var alternate = fiber.alternate;
        if (!alternate) {
          var state = isFiberMountedImpl(fiber);
          !(state !== UNMOUNTED) ? invariant(false, 'Unable to find node on an unmounted component.') : void 0;
          if (state === MOUNTING) {
            return null;
          }
          return fiber;
        }
        var a = fiber;
        var b = alternate;
        while (true) {
          var parentA = a['return'];
          var parentB = parentA ? parentA.alternate : null;
          if (!parentA || !parentB) {
            break;
          }
          if (parentA.child === parentB.child) {
            var child = parentA.child;
            while (child) {
              if (child === a) {
                assertIsMounted(parentA);
                return fiber;
              }
              if (child === b) {
                assertIsMounted(parentA);
                return alternate;
              }
              child = child.sibling;
            }
            invariant(false, 'Unable to find node on an unmounted component.');
          }
          if (a['return'] !== b['return']) {
            a = parentA;
            b = parentB;
          } else {
            var didFindChild = false;
            var _child = parentA.child;
            while (_child) {
              if (_child === a) {
                didFindChild = true;
                a = parentA;
                b = parentB;
                break;
              }
              if (_child === b) {
                didFindChild = true;
                b = parentA;
                a = parentB;
                break;
              }
              _child = _child.sibling;
            }
            if (!didFindChild) {
              _child = parentB.child;
              while (_child) {
                if (_child === a) {
                  didFindChild = true;
                  a = parentB;
                  b = parentA;
                  break;
                }
                if (_child === b) {
                  didFindChild = true;
                  b = parentB;
                  a = parentA;
                  break;
                }
                _child = _child.sibling;
              }
              !didFindChild ? invariant(false, 'Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.') : void 0;
            }
          }
          !(a.alternate === b) ? invariant(false, 'Return fibers should always be each others\' alternates. This error is likely caused by a bug in React. Please file an issue.') : void 0;
        }
        !(a.tag === HostRoot) ? invariant(false, 'Unable to find node on an unmounted component.') : void 0;
        if (a.stateNode.current === a) {
          return fiber;
        }
        return alternate;
      }
      function findCurrentHostFiber(parent) {
        var currentParent = findCurrentFiberUsingSlowPath(parent);
        if (!currentParent) {
          return null;
        }
        var node = currentParent;
        while (true) {
          if (node.tag === HostComponent || node.tag === HostText) {
            return node;
          } else if (node.child) {
            node.child['return'] = node;
            node = node.child;
            continue;
          }
          if (node === currentParent) {
            return null;
          }
          while (!node.sibling) {
            if (!node['return'] || node['return'] === currentParent) {
              return null;
            }
            node = node['return'];
          }
          node.sibling['return'] = node['return'];
          node = node.sibling;
        }
        return null;
      }
      function findCurrentHostFiberWithNoPortals(parent) {
        var currentParent = findCurrentFiberUsingSlowPath(parent);
        if (!currentParent) {
          return null;
        }
        var node = currentParent;
        while (true) {
          if (node.tag === HostComponent || node.tag === HostText) {
            return node;
          } else if (node.child && node.tag !== HostPortal) {
            node.child['return'] = node;
            node = node.child;
            continue;
          }
          if (node === currentParent) {
            return null;
          }
          while (!node.sibling) {
            if (!node['return'] || node['return'] === currentParent) {
              return null;
            }
            node = node['return'];
          }
          node.sibling['return'] = node['return'];
          node = node.sibling;
        }
        return null;
      }
      var CALLBACK_BOOKKEEPING_POOL_SIZE = 10;
      var callbackBookkeepingPool = [];
      function findRootContainerNode(inst) {
        while (inst['return']) {
          inst = inst['return'];
        }
        if (inst.tag !== HostRoot) {
          return null;
        }
        return inst.stateNode.containerInfo;
      }
      function getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst) {
        if (callbackBookkeepingPool.length) {
          var instance = callbackBookkeepingPool.pop();
          instance.topLevelType = topLevelType;
          instance.nativeEvent = nativeEvent;
          instance.targetInst = targetInst;
          return instance;
        }
        return {
          topLevelType: topLevelType,
          nativeEvent: nativeEvent,
          targetInst: targetInst,
          ancestors: []
        };
      }
      function releaseTopLevelCallbackBookKeeping(instance) {
        instance.topLevelType = null;
        instance.nativeEvent = null;
        instance.targetInst = null;
        instance.ancestors.length = 0;
        if (callbackBookkeepingPool.length < CALLBACK_BOOKKEEPING_POOL_SIZE) {
          callbackBookkeepingPool.push(instance);
        }
      }
      function handleTopLevelImpl(bookKeeping) {
        var targetInst = bookKeeping.targetInst;
        var ancestor = targetInst;
        do {
          if (!ancestor) {
            bookKeeping.ancestors.push(ancestor);
            break;
          }
          var root = findRootContainerNode(ancestor);
          if (!root) {
            break;
          }
          bookKeeping.ancestors.push(ancestor);
          ancestor = getClosestInstanceFromNode(root);
        } while (ancestor);
        for (var i = 0; i < bookKeeping.ancestors.length; i++) {
          targetInst = bookKeeping.ancestors[i];
          _handleTopLevel(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget(bookKeeping.nativeEvent));
        }
      }
      var _enabled = true;
      var _handleTopLevel = void 0;
      function setHandleTopLevel(handleTopLevel) {
        _handleTopLevel = handleTopLevel;
      }
      function setEnabled(enabled) {
        _enabled = !!enabled;
      }
      function isEnabled() {
        return _enabled;
      }
      function trapBubbledEvent(topLevelType, handlerBaseName, element) {
        if (!element) {
          return null;
        }
        return EventListener.listen(element, handlerBaseName, dispatchEvent.bind(null, topLevelType));
      }
      function trapCapturedEvent(topLevelType, handlerBaseName, element) {
        if (!element) {
          return null;
        }
        return EventListener.capture(element, handlerBaseName, dispatchEvent.bind(null, topLevelType));
      }
      function dispatchEvent(topLevelType, nativeEvent) {
        if (!_enabled) {
          return;
        }
        var nativeEventTarget = getEventTarget(nativeEvent);
        var targetInst = getClosestInstanceFromNode(nativeEventTarget);
        if (targetInst !== null && typeof targetInst.tag === 'number' && !isFiberMounted(targetInst)) {
          targetInst = null;
        }
        var bookKeeping = getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst);
        try {
          batchedUpdates(handleTopLevelImpl, bookKeeping);
        } finally {
          releaseTopLevelCallbackBookKeeping(bookKeeping);
        }
      }
      var ReactDOMEventListener = Object.freeze({
        get _enabled() {
          return _enabled;
        },
        get _handleTopLevel() {
          return _handleTopLevel;
        },
        setHandleTopLevel: setHandleTopLevel,
        setEnabled: setEnabled,
        isEnabled: isEnabled,
        trapBubbledEvent: trapBubbledEvent,
        trapCapturedEvent: trapCapturedEvent,
        dispatchEvent: dispatchEvent
      });
      function makePrefixMap(styleProp, eventName) {
        var prefixes = {};
        prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
        prefixes['Webkit' + styleProp] = 'webkit' + eventName;
        prefixes['Moz' + styleProp] = 'moz' + eventName;
        prefixes['ms' + styleProp] = 'MS' + eventName;
        prefixes['O' + styleProp] = 'o' + eventName.toLowerCase();
        return prefixes;
      }
      var vendorPrefixes = {
        animationend: makePrefixMap('Animation', 'AnimationEnd'),
        animationiteration: makePrefixMap('Animation', 'AnimationIteration'),
        animationstart: makePrefixMap('Animation', 'AnimationStart'),
        transitionend: makePrefixMap('Transition', 'TransitionEnd')
      };
      var prefixedEventNames = {};
      var style = {};
      if (ExecutionEnvironment.canUseDOM) {
        style = document.createElement('div').style;
        if (!('AnimationEvent' in window)) {
          delete vendorPrefixes.animationend.animation;
          delete vendorPrefixes.animationiteration.animation;
          delete vendorPrefixes.animationstart.animation;
        }
        if (!('TransitionEvent' in window)) {
          delete vendorPrefixes.transitionend.transition;
        }
      }
      function getVendorPrefixedEventName(eventName) {
        if (prefixedEventNames[eventName]) {
          return prefixedEventNames[eventName];
        } else if (!vendorPrefixes[eventName]) {
          return eventName;
        }
        var prefixMap = vendorPrefixes[eventName];
        for (var styleProp in prefixMap) {
          if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
            return prefixedEventNames[eventName] = prefixMap[styleProp];
          }
        }
        return '';
      }
      var topLevelTypes$1 = {
        topAbort: 'abort',
        topAnimationEnd: getVendorPrefixedEventName('animationend') || 'animationend',
        topAnimationIteration: getVendorPrefixedEventName('animationiteration') || 'animationiteration',
        topAnimationStart: getVendorPrefixedEventName('animationstart') || 'animationstart',
        topBlur: 'blur',
        topCancel: 'cancel',
        topCanPlay: 'canplay',
        topCanPlayThrough: 'canplaythrough',
        topChange: 'change',
        topClick: 'click',
        topClose: 'close',
        topCompositionEnd: 'compositionend',
        topCompositionStart: 'compositionstart',
        topCompositionUpdate: 'compositionupdate',
        topContextMenu: 'contextmenu',
        topCopy: 'copy',
        topCut: 'cut',
        topDoubleClick: 'dblclick',
        topDrag: 'drag',
        topDragEnd: 'dragend',
        topDragEnter: 'dragenter',
        topDragExit: 'dragexit',
        topDragLeave: 'dragleave',
        topDragOver: 'dragover',
        topDragStart: 'dragstart',
        topDrop: 'drop',
        topDurationChange: 'durationchange',
        topEmptied: 'emptied',
        topEncrypted: 'encrypted',
        topEnded: 'ended',
        topError: 'error',
        topFocus: 'focus',
        topInput: 'input',
        topKeyDown: 'keydown',
        topKeyPress: 'keypress',
        topKeyUp: 'keyup',
        topLoadedData: 'loadeddata',
        topLoad: 'load',
        topLoadedMetadata: 'loadedmetadata',
        topLoadStart: 'loadstart',
        topMouseDown: 'mousedown',
        topMouseMove: 'mousemove',
        topMouseOut: 'mouseout',
        topMouseOver: 'mouseover',
        topMouseUp: 'mouseup',
        topPaste: 'paste',
        topPause: 'pause',
        topPlay: 'play',
        topPlaying: 'playing',
        topProgress: 'progress',
        topRateChange: 'ratechange',
        topScroll: 'scroll',
        topSeeked: 'seeked',
        topSeeking: 'seeking',
        topSelectionChange: 'selectionchange',
        topStalled: 'stalled',
        topSuspend: 'suspend',
        topTextInput: 'textInput',
        topTimeUpdate: 'timeupdate',
        topToggle: 'toggle',
        topTouchCancel: 'touchcancel',
        topTouchEnd: 'touchend',
        topTouchMove: 'touchmove',
        topTouchStart: 'touchstart',
        topTransitionEnd: getVendorPrefixedEventName('transitionend') || 'transitionend',
        topVolumeChange: 'volumechange',
        topWaiting: 'waiting',
        topWheel: 'wheel'
      };
      var BrowserEventConstants = {topLevelTypes: topLevelTypes$1};
      function runEventQueueInBatch(events) {
        enqueueEvents(events);
        processEventQueue(false);
      }
      function handleTopLevel(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var events = extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
        runEventQueueInBatch(events);
      }
      var topLevelTypes = BrowserEventConstants.topLevelTypes;
      var alreadyListeningTo = {};
      var reactTopListenersCounter = 0;
      var topListenersIDKey = '_reactListenersID' + ('' + Math.random()).slice(2);
      function getListeningForDocument(mountAt) {
        if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
          mountAt[topListenersIDKey] = reactTopListenersCounter++;
          alreadyListeningTo[mountAt[topListenersIDKey]] = {};
        }
        return alreadyListeningTo[mountAt[topListenersIDKey]];
      }
      function listenTo(registrationName, contentDocumentHandle) {
        var mountAt = contentDocumentHandle;
        var isListening = getListeningForDocument(mountAt);
        var dependencies = registrationNameDependencies[registrationName];
        for (var i = 0; i < dependencies.length; i++) {
          var dependency = dependencies[i];
          if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
            if (dependency === 'topWheel') {
              if (isEventSupported('wheel')) {
                trapBubbledEvent('topWheel', 'wheel', mountAt);
              } else if (isEventSupported('mousewheel')) {
                trapBubbledEvent('topWheel', 'mousewheel', mountAt);
              } else {
                trapBubbledEvent('topWheel', 'DOMMouseScroll', mountAt);
              }
            } else if (dependency === 'topScroll') {
              trapCapturedEvent('topScroll', 'scroll', mountAt);
            } else if (dependency === 'topFocus' || dependency === 'topBlur') {
              trapCapturedEvent('topFocus', 'focus', mountAt);
              trapCapturedEvent('topBlur', 'blur', mountAt);
              isListening.topBlur = true;
              isListening.topFocus = true;
            } else if (dependency === 'topCancel') {
              if (isEventSupported('cancel', true)) {
                trapCapturedEvent('topCancel', 'cancel', mountAt);
              }
              isListening.topCancel = true;
            } else if (dependency === 'topClose') {
              if (isEventSupported('close', true)) {
                trapCapturedEvent('topClose', 'close', mountAt);
              }
              isListening.topClose = true;
            } else if (topLevelTypes.hasOwnProperty(dependency)) {
              trapBubbledEvent(dependency, topLevelTypes[dependency], mountAt);
            }
            isListening[dependency] = true;
          }
        }
      }
      function isListeningToAllDependencies(registrationName, mountAt) {
        var isListening = getListeningForDocument(mountAt);
        var dependencies = registrationNameDependencies[registrationName];
        for (var i = 0; i < dependencies.length; i++) {
          var dependency = dependencies[i];
          if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
            return false;
          }
        }
        return true;
      }
      function getLeafNode(node) {
        while (node && node.firstChild) {
          node = node.firstChild;
        }
        return node;
      }
      function getSiblingNode(node) {
        while (node) {
          if (node.nextSibling) {
            return node.nextSibling;
          }
          node = node.parentNode;
        }
      }
      function getNodeForCharacterOffset(root, offset) {
        var node = getLeafNode(root);
        var nodeStart = 0;
        var nodeEnd = 0;
        while (node) {
          if (node.nodeType === TEXT_NODE) {
            nodeEnd = nodeStart + node.textContent.length;
            if (nodeStart <= offset && nodeEnd >= offset) {
              return {
                node: node,
                offset: offset - nodeStart
              };
            }
            nodeStart = nodeEnd;
          }
          node = getLeafNode(getSiblingNode(node));
        }
      }
      function getOffsets(outerNode) {
        var selection = window.getSelection && window.getSelection();
        if (!selection || selection.rangeCount === 0) {
          return null;
        }
        var anchorNode = selection.anchorNode;
        var anchorOffset = selection.anchorOffset;
        var focusNode$$1 = selection.focusNode;
        var focusOffset = selection.focusOffset;
        try {
          anchorNode.nodeType;
          focusNode$$1.nodeType;
        } catch (e) {
          return null;
        }
        return getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode$$1, focusOffset);
      }
      function getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode$$1, focusOffset) {
        var length = 0;
        var start = -1;
        var end = -1;
        var indexWithinAnchor = 0;
        var indexWithinFocus = 0;
        var node = outerNode;
        var parentNode = null;
        outer: while (true) {
          var next = null;
          while (true) {
            if (node === anchorNode && (anchorOffset === 0 || node.nodeType === TEXT_NODE)) {
              start = length + anchorOffset;
            }
            if (node === focusNode$$1 && (focusOffset === 0 || node.nodeType === TEXT_NODE)) {
              end = length + focusOffset;
            }
            if (node.nodeType === TEXT_NODE) {
              length += node.nodeValue.length;
            }
            if ((next = node.firstChild) === null) {
              break;
            }
            parentNode = node;
            node = next;
          }
          while (true) {
            if (node === outerNode) {
              break outer;
            }
            if (parentNode === anchorNode && ++indexWithinAnchor === anchorOffset) {
              start = length;
            }
            if (parentNode === focusNode$$1 && ++indexWithinFocus === focusOffset) {
              end = length;
            }
            if ((next = node.nextSibling) !== null) {
              break;
            }
            node = parentNode;
            parentNode = node.parentNode;
          }
          node = next;
        }
        if (start === -1 || end === -1) {
          return null;
        }
        return {
          start: start,
          end: end
        };
      }
      function setOffsets(node, offsets) {
        if (!window.getSelection) {
          return;
        }
        var selection = window.getSelection();
        var length = node[getTextContentAccessor()].length;
        var start = Math.min(offsets.start, length);
        var end = offsets.end === undefined ? start : Math.min(offsets.end, length);
        if (!selection.extend && start > end) {
          var temp = end;
          end = start;
          start = temp;
        }
        var startMarker = getNodeForCharacterOffset(node, start);
        var endMarker = getNodeForCharacterOffset(node, end);
        if (startMarker && endMarker) {
          if (selection.rangeCount === 1 && selection.anchorNode === startMarker.node && selection.anchorOffset === startMarker.offset && selection.focusNode === endMarker.node && selection.focusOffset === endMarker.offset) {
            return;
          }
          var range = document.createRange();
          range.setStart(startMarker.node, startMarker.offset);
          selection.removeAllRanges();
          if (start > end) {
            selection.addRange(range);
            selection.extend(endMarker.node, endMarker.offset);
          } else {
            range.setEnd(endMarker.node, endMarker.offset);
            selection.addRange(range);
          }
        }
      }
      function isInDocument(node) {
        return containsNode(document.documentElement, node);
      }
      function hasSelectionCapabilities(elem) {
        var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
        return nodeName && (nodeName === 'input' && elem.type === 'text' || nodeName === 'textarea' || elem.contentEditable === 'true');
      }
      function getSelectionInformation() {
        var focusedElem = getActiveElement();
        return {
          focusedElem: focusedElem,
          selectionRange: hasSelectionCapabilities(focusedElem) ? getSelection$1(focusedElem) : null
        };
      }
      function restoreSelection(priorSelectionInformation) {
        var curFocusedElem = getActiveElement();
        var priorFocusedElem = priorSelectionInformation.focusedElem;
        var priorSelectionRange = priorSelectionInformation.selectionRange;
        if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
          if (hasSelectionCapabilities(priorFocusedElem)) {
            setSelection(priorFocusedElem, priorSelectionRange);
          }
          var ancestors = [];
          var ancestor = priorFocusedElem;
          while (ancestor = ancestor.parentNode) {
            if (ancestor.nodeType === ELEMENT_NODE) {
              ancestors.push({
                element: ancestor,
                left: ancestor.scrollLeft,
                top: ancestor.scrollTop
              });
            }
          }
          focusNode(priorFocusedElem);
          for (var i = 0; i < ancestors.length; i++) {
            var info = ancestors[i];
            info.element.scrollLeft = info.left;
            info.element.scrollTop = info.top;
          }
        }
      }
      function getSelection$1(input) {
        var selection = void 0;
        if ('selectionStart' in input) {
          selection = {
            start: input.selectionStart,
            end: input.selectionEnd
          };
        } else {
          selection = getOffsets(input);
        }
        return selection || {
          start: 0,
          end: 0
        };
      }
      function setSelection(input, offsets) {
        var start = offsets.start,
            end = offsets.end;
        if (end === undefined) {
          end = start;
        }
        if ('selectionStart' in input) {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, input.value.length);
        } else {
          setOffsets(input, offsets);
        }
      }
      var skipSelectionChangeEvent = ExecutionEnvironment.canUseDOM && 'documentMode' in document && document.documentMode <= 11;
      var eventTypes$3 = {select: {
          phasedRegistrationNames: {
            bubbled: 'onSelect',
            captured: 'onSelectCapture'
          },
          dependencies: ['topBlur', 'topContextMenu', 'topFocus', 'topKeyDown', 'topKeyUp', 'topMouseDown', 'topMouseUp', 'topSelectionChange']
        }};
      var activeElement$1 = null;
      var activeElementInst$1 = null;
      var lastSelection = null;
      var mouseDown = false;
      function getSelection(node) {
        if ('selectionStart' in node && hasSelectionCapabilities(node)) {
          return {
            start: node.selectionStart,
            end: node.selectionEnd
          };
        } else if (window.getSelection) {
          var selection = window.getSelection();
          return {
            anchorNode: selection.anchorNode,
            anchorOffset: selection.anchorOffset,
            focusNode: selection.focusNode,
            focusOffset: selection.focusOffset
          };
        }
      }
      function constructSelectEvent(nativeEvent, nativeEventTarget) {
        if (mouseDown || activeElement$1 == null || activeElement$1 !== getActiveElement()) {
          return null;
        }
        var currentSelection = getSelection(activeElement$1);
        if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
          lastSelection = currentSelection;
          var syntheticEvent = SyntheticEvent$1.getPooled(eventTypes$3.select, activeElementInst$1, nativeEvent, nativeEventTarget);
          syntheticEvent.type = 'select';
          syntheticEvent.target = activeElement$1;
          accumulateTwoPhaseDispatches(syntheticEvent);
          return syntheticEvent;
        }
        return null;
      }
      var SelectEventPlugin = {
        eventTypes: eventTypes$3,
        extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
          var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : nativeEventTarget.nodeType === DOCUMENT_NODE ? nativeEventTarget : nativeEventTarget.ownerDocument;
          if (!doc || !isListeningToAllDependencies('onSelect', doc)) {
            return null;
          }
          var targetNode = targetInst ? getNodeFromInstance$1(targetInst) : window;
          switch (topLevelType) {
            case 'topFocus':
              if (isTextInputElement(targetNode) || targetNode.contentEditable === 'true') {
                activeElement$1 = targetNode;
                activeElementInst$1 = targetInst;
                lastSelection = null;
              }
              break;
            case 'topBlur':
              activeElement$1 = null;
              activeElementInst$1 = null;
              lastSelection = null;
              break;
            case 'topMouseDown':
              mouseDown = true;
              break;
            case 'topContextMenu':
            case 'topMouseUp':
              mouseDown = false;
              return constructSelectEvent(nativeEvent, nativeEventTarget);
            case 'topSelectionChange':
              if (skipSelectionChangeEvent) {
                break;
              }
            case 'topKeyDown':
            case 'topKeyUp':
              return constructSelectEvent(nativeEvent, nativeEventTarget);
          }
          return null;
        }
      };
      var AnimationEventInterface = {
        animationName: null,
        elapsedTime: null,
        pseudoElement: null
      };
      function SyntheticAnimationEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticEvent$1.augmentClass(SyntheticAnimationEvent, AnimationEventInterface);
      var ClipboardEventInterface = {clipboardData: function(event) {
          return 'clipboardData' in event ? event.clipboardData : window.clipboardData;
        }};
      function SyntheticClipboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticEvent$1.augmentClass(SyntheticClipboardEvent, ClipboardEventInterface);
      var FocusEventInterface = {relatedTarget: null};
      function SyntheticFocusEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticUIEvent.augmentClass(SyntheticFocusEvent, FocusEventInterface);
      function getEventCharCode(nativeEvent) {
        var charCode;
        var keyCode = nativeEvent.keyCode;
        if ('charCode' in nativeEvent) {
          charCode = nativeEvent.charCode;
          if (charCode === 0 && keyCode === 13) {
            charCode = 13;
          }
        } else {
          charCode = keyCode;
        }
        if (charCode >= 32 || charCode === 13) {
          return charCode;
        }
        return 0;
      }
      var normalizeKey = {
        Esc: 'Escape',
        Spacebar: ' ',
        Left: 'ArrowLeft',
        Up: 'ArrowUp',
        Right: 'ArrowRight',
        Down: 'ArrowDown',
        Del: 'Delete',
        Win: 'OS',
        Menu: 'ContextMenu',
        Apps: 'ContextMenu',
        Scroll: 'ScrollLock',
        MozPrintableKey: 'Unidentified'
      };
      var translateToKey = {
        '8': 'Backspace',
        '9': 'Tab',
        '12': 'Clear',
        '13': 'Enter',
        '16': 'Shift',
        '17': 'Control',
        '18': 'Alt',
        '19': 'Pause',
        '20': 'CapsLock',
        '27': 'Escape',
        '32': ' ',
        '33': 'PageUp',
        '34': 'PageDown',
        '35': 'End',
        '36': 'Home',
        '37': 'ArrowLeft',
        '38': 'ArrowUp',
        '39': 'ArrowRight',
        '40': 'ArrowDown',
        '45': 'Insert',
        '46': 'Delete',
        '112': 'F1',
        '113': 'F2',
        '114': 'F3',
        '115': 'F4',
        '116': 'F5',
        '117': 'F6',
        '118': 'F7',
        '119': 'F8',
        '120': 'F9',
        '121': 'F10',
        '122': 'F11',
        '123': 'F12',
        '144': 'NumLock',
        '145': 'ScrollLock',
        '224': 'Meta'
      };
      function getEventKey(nativeEvent) {
        if (nativeEvent.key) {
          var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
          if (key !== 'Unidentified') {
            return key;
          }
        }
        if (nativeEvent.type === 'keypress') {
          var charCode = getEventCharCode(nativeEvent);
          return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
        }
        if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
          return translateToKey[nativeEvent.keyCode] || 'Unidentified';
        }
        return '';
      }
      var KeyboardEventInterface = {
        key: getEventKey,
        location: null,
        ctrlKey: null,
        shiftKey: null,
        altKey: null,
        metaKey: null,
        repeat: null,
        locale: null,
        getModifierState: getEventModifierState,
        charCode: function(event) {
          if (event.type === 'keypress') {
            return getEventCharCode(event);
          }
          return 0;
        },
        keyCode: function(event) {
          if (event.type === 'keydown' || event.type === 'keyup') {
            return event.keyCode;
          }
          return 0;
        },
        which: function(event) {
          if (event.type === 'keypress') {
            return getEventCharCode(event);
          }
          if (event.type === 'keydown' || event.type === 'keyup') {
            return event.keyCode;
          }
          return 0;
        }
      };
      function SyntheticKeyboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticUIEvent.augmentClass(SyntheticKeyboardEvent, KeyboardEventInterface);
      var DragEventInterface = {dataTransfer: null};
      function SyntheticDragEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticMouseEvent.augmentClass(SyntheticDragEvent, DragEventInterface);
      var TouchEventInterface = {
        touches: null,
        targetTouches: null,
        changedTouches: null,
        altKey: null,
        metaKey: null,
        ctrlKey: null,
        shiftKey: null,
        getModifierState: getEventModifierState
      };
      function SyntheticTouchEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticUIEvent.augmentClass(SyntheticTouchEvent, TouchEventInterface);
      var TransitionEventInterface = {
        propertyName: null,
        elapsedTime: null,
        pseudoElement: null
      };
      function SyntheticTransitionEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticEvent$1.augmentClass(SyntheticTransitionEvent, TransitionEventInterface);
      var WheelEventInterface = {
        deltaX: function(event) {
          return 'deltaX' in event ? event.deltaX : 'wheelDeltaX' in event ? -event.wheelDeltaX : 0;
        },
        deltaY: function(event) {
          return 'deltaY' in event ? event.deltaY : 'wheelDeltaY' in event ? -event.wheelDeltaY : 'wheelDelta' in event ? -event.wheelDelta : 0;
        },
        deltaZ: null,
        deltaMode: null
      };
      function SyntheticWheelEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
      }
      SyntheticMouseEvent.augmentClass(SyntheticWheelEvent, WheelEventInterface);
      var eventTypes$4 = {};
      var topLevelEventsToDispatchConfig = {};
      ['abort', 'animationEnd', 'animationIteration', 'animationStart', 'blur', 'cancel', 'canPlay', 'canPlayThrough', 'click', 'close', 'contextMenu', 'copy', 'cut', 'doubleClick', 'drag', 'dragEnd', 'dragEnter', 'dragExit', 'dragLeave', 'dragOver', 'dragStart', 'drop', 'durationChange', 'emptied', 'encrypted', 'ended', 'error', 'focus', 'input', 'invalid', 'keyDown', 'keyPress', 'keyUp', 'load', 'loadedData', 'loadedMetadata', 'loadStart', 'mouseDown', 'mouseMove', 'mouseOut', 'mouseOver', 'mouseUp', 'paste', 'pause', 'play', 'playing', 'progress', 'rateChange', 'reset', 'scroll', 'seeked', 'seeking', 'stalled', 'submit', 'suspend', 'timeUpdate', 'toggle', 'touchCancel', 'touchEnd', 'touchMove', 'touchStart', 'transitionEnd', 'volumeChange', 'waiting', 'wheel'].forEach(function(event) {
        var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
        var onEvent = 'on' + capitalizedEvent;
        var topEvent = 'top' + capitalizedEvent;
        var type = {
          phasedRegistrationNames: {
            bubbled: onEvent,
            captured: onEvent + 'Capture'
          },
          dependencies: [topEvent]
        };
        eventTypes$4[event] = type;
        topLevelEventsToDispatchConfig[topEvent] = type;
      });
      var knownHTMLTopLevelTypes = ['topAbort', 'topCancel', 'topCanPlay', 'topCanPlayThrough', 'topClose', 'topDurationChange', 'topEmptied', 'topEncrypted', 'topEnded', 'topError', 'topInput', 'topInvalid', 'topLoad', 'topLoadedData', 'topLoadedMetadata', 'topLoadStart', 'topPause', 'topPlay', 'topPlaying', 'topProgress', 'topRateChange', 'topReset', 'topSeeked', 'topSeeking', 'topStalled', 'topSubmit', 'topSuspend', 'topTimeUpdate', 'topToggle', 'topVolumeChange', 'topWaiting'];
      var SimpleEventPlugin = {
        eventTypes: eventTypes$4,
        extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
          var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
          if (!dispatchConfig) {
            return null;
          }
          var EventConstructor;
          switch (topLevelType) {
            case 'topKeyPress':
              if (getEventCharCode(nativeEvent) === 0) {
                return null;
              }
            case 'topKeyDown':
            case 'topKeyUp':
              EventConstructor = SyntheticKeyboardEvent;
              break;
            case 'topBlur':
            case 'topFocus':
              EventConstructor = SyntheticFocusEvent;
              break;
            case 'topClick':
              if (nativeEvent.button === 2) {
                return null;
              }
            case 'topDoubleClick':
            case 'topMouseDown':
            case 'topMouseMove':
            case 'topMouseUp':
            case 'topMouseOut':
            case 'topMouseOver':
            case 'topContextMenu':
              EventConstructor = SyntheticMouseEvent;
              break;
            case 'topDrag':
            case 'topDragEnd':
            case 'topDragEnter':
            case 'topDragExit':
            case 'topDragLeave':
            case 'topDragOver':
            case 'topDragStart':
            case 'topDrop':
              EventConstructor = SyntheticDragEvent;
              break;
            case 'topTouchCancel':
            case 'topTouchEnd':
            case 'topTouchMove':
            case 'topTouchStart':
              EventConstructor = SyntheticTouchEvent;
              break;
            case 'topAnimationEnd':
            case 'topAnimationIteration':
            case 'topAnimationStart':
              EventConstructor = SyntheticAnimationEvent;
              break;
            case 'topTransitionEnd':
              EventConstructor = SyntheticTransitionEvent;
              break;
            case 'topScroll':
              EventConstructor = SyntheticUIEvent;
              break;
            case 'topWheel':
              EventConstructor = SyntheticWheelEvent;
              break;
            case 'topCopy':
            case 'topCut':
            case 'topPaste':
              EventConstructor = SyntheticClipboardEvent;
              break;
            default:
              {
                if (knownHTMLTopLevelTypes.indexOf(topLevelType) === -1) {
                  warning(false, 'SimpleEventPlugin: Unhandled event type, `%s`. This warning ' + 'is likely caused by a bug in React. Please file an issue.', topLevelType);
                }
              }
              EventConstructor = SyntheticEvent$1;
              break;
          }
          var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
          accumulateTwoPhaseDispatches(event);
          return event;
        }
      };
      setHandleTopLevel(handleTopLevel);
      injection$1.injectEventPluginOrder(DOMEventPluginOrder);
      injection$2.injectComponentTree(ReactDOMComponentTree);
      injection$1.injectEventPluginsByName({
        SimpleEventPlugin: SimpleEventPlugin,
        EnterLeaveEventPlugin: EnterLeaveEventPlugin,
        ChangeEventPlugin: ChangeEventPlugin,
        SelectEventPlugin: SelectEventPlugin,
        BeforeInputEventPlugin: BeforeInputEventPlugin
      });
      var enableAsyncSubtreeAPI = true;
      var enableAsyncSchedulingByDefaultInReactDOM = false;
      var enableReactFragment = false;
      var enableCreateRoot = false;
      var enableUserTimingAPI = true;
      var enableMutatingReconciler = true;
      var enableNoopReconciler = false;
      var enablePersistentReconciler = false;
      var valueStack = [];
      {
        var fiberStack = [];
      }
      var index = -1;
      function createCursor(defaultValue) {
        return {current: defaultValue};
      }
      function pop(cursor, fiber) {
        if (index < 0) {
          {
            warning(false, 'Unexpected pop.');
          }
          return;
        }
        {
          if (fiber !== fiberStack[index]) {
            warning(false, 'Unexpected Fiber popped.');
          }
        }
        cursor.current = valueStack[index];
        valueStack[index] = null;
        {
          fiberStack[index] = null;
        }
        index--;
      }
      function push(cursor, value, fiber) {
        index++;
        valueStack[index] = cursor.current;
        {
          fiberStack[index] = fiber;
        }
        cursor.current = value;
      }
      function reset$1() {
        while (index > -1) {
          valueStack[index] = null;
          {
            fiberStack[index] = null;
          }
          index--;
        }
      }
      var describeComponentFrame = function(name, source, ownerName) {
        return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
      };
      function describeFiber(fiber) {
        switch (fiber.tag) {
          case IndeterminateComponent:
          case FunctionalComponent:
          case ClassComponent:
          case HostComponent:
            var owner = fiber._debugOwner;
            var source = fiber._debugSource;
            var name = getComponentName(fiber);
            var ownerName = null;
            if (owner) {
              ownerName = getComponentName(owner);
            }
            return describeComponentFrame(name, source, ownerName);
          default:
            return '';
        }
      }
      function getStackAddendumByWorkInProgressFiber(workInProgress) {
        var info = '';
        var node = workInProgress;
        do {
          info += describeFiber(node);
          node = node['return'];
        } while (node);
        return info;
      }
      function getCurrentFiberOwnerName() {
        {
          var fiber = ReactDebugCurrentFiber.current;
          if (fiber === null) {
            return null;
          }
          var owner = fiber._debugOwner;
          if (owner !== null && typeof owner !== 'undefined') {
            return getComponentName(owner);
          }
        }
        return null;
      }
      function getCurrentFiberStackAddendum() {
        {
          var fiber = ReactDebugCurrentFiber.current;
          if (fiber === null) {
            return null;
          }
          return getStackAddendumByWorkInProgressFiber(fiber);
        }
        return null;
      }
      function resetCurrentFiber() {
        ReactDebugCurrentFrame.getCurrentStack = null;
        ReactDebugCurrentFiber.current = null;
        ReactDebugCurrentFiber.phase = null;
      }
      function setCurrentFiber(fiber) {
        ReactDebugCurrentFrame.getCurrentStack = getCurrentFiberStackAddendum;
        ReactDebugCurrentFiber.current = fiber;
        ReactDebugCurrentFiber.phase = null;
      }
      function setCurrentPhase(phase) {
        ReactDebugCurrentFiber.phase = phase;
      }
      var ReactDebugCurrentFiber = {
        current: null,
        phase: null,
        resetCurrentFiber: resetCurrentFiber,
        setCurrentFiber: setCurrentFiber,
        setCurrentPhase: setCurrentPhase,
        getCurrentFiberOwnerName: getCurrentFiberOwnerName,
        getCurrentFiberStackAddendum: getCurrentFiberStackAddendum
      };
      var reactEmoji = '\u269B';
      var warningEmoji = '\u26D4';
      var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';
      var currentFiber = null;
      var currentPhase = null;
      var currentPhaseFiber = null;
      var isCommitting = false;
      var hasScheduledUpdateInCurrentCommit = false;
      var hasScheduledUpdateInCurrentPhase = false;
      var commitCountInCurrentWorkLoop = 0;
      var effectCountInCurrentCommit = 0;
      var labelsInCurrentCommit = new Set();
      var formatMarkName = function(markName) {
        return reactEmoji + ' ' + markName;
      };
      var formatLabel = function(label, warning$$1) {
        var prefix = warning$$1 ? warningEmoji + ' ' : reactEmoji + ' ';
        var suffix = warning$$1 ? ' Warning: ' + warning$$1 : '';
        return '' + prefix + label + suffix;
      };
      var beginMark = function(markName) {
        performance.mark(formatMarkName(markName));
      };
      var clearMark = function(markName) {
        performance.clearMarks(formatMarkName(markName));
      };
      var endMark = function(label, markName, warning$$1) {
        var formattedMarkName = formatMarkName(markName);
        var formattedLabel = formatLabel(label, warning$$1);
        try {
          performance.measure(formattedLabel, formattedMarkName);
        } catch (err) {}
        performance.clearMarks(formattedMarkName);
        performance.clearMeasures(formattedLabel);
      };
      var getFiberMarkName = function(label, debugID) {
        return label + ' (#' + debugID + ')';
      };
      var getFiberLabel = function(componentName, isMounted, phase) {
        if (phase === null) {
          return componentName + ' [' + (isMounted ? 'update' : 'mount') + ']';
        } else {
          return componentName + '.' + phase;
        }
      };
      var beginFiberMark = function(fiber, phase) {
        var componentName = getComponentName(fiber) || 'Unknown';
        var debugID = fiber._debugID;
        var isMounted = fiber.alternate !== null;
        var label = getFiberLabel(componentName, isMounted, phase);
        if (isCommitting && labelsInCurrentCommit.has(label)) {
          return false;
        }
        labelsInCurrentCommit.add(label);
        var markName = getFiberMarkName(label, debugID);
        beginMark(markName);
        return true;
      };
      var clearFiberMark = function(fiber, phase) {
        var componentName = getComponentName(fiber) || 'Unknown';
        var debugID = fiber._debugID;
        var isMounted = fiber.alternate !== null;
        var label = getFiberLabel(componentName, isMounted, phase);
        var markName = getFiberMarkName(label, debugID);
        clearMark(markName);
      };
      var endFiberMark = function(fiber, phase, warning$$1) {
        var componentName = getComponentName(fiber) || 'Unknown';
        var debugID = fiber._debugID;
        var isMounted = fiber.alternate !== null;
        var label = getFiberLabel(componentName, isMounted, phase);
        var markName = getFiberMarkName(label, debugID);
        endMark(label, markName, warning$$1);
      };
      var shouldIgnoreFiber = function(fiber) {
        switch (fiber.tag) {
          case HostRoot:
          case HostComponent:
          case HostText:
          case HostPortal:
          case ReturnComponent:
          case Fragment:
            return true;
          default:
            return false;
        }
      };
      var clearPendingPhaseMeasurement = function() {
        if (currentPhase !== null && currentPhaseFiber !== null) {
          clearFiberMark(currentPhaseFiber, currentPhase);
        }
        currentPhaseFiber = null;
        currentPhase = null;
        hasScheduledUpdateInCurrentPhase = false;
      };
      var pauseTimers = function() {
        var fiber = currentFiber;
        while (fiber) {
          if (fiber._debugIsCurrentlyTiming) {
            endFiberMark(fiber, null, null);
          }
          fiber = fiber['return'];
        }
      };
      var resumeTimersRecursively = function(fiber) {
        if (fiber['return'] !== null) {
          resumeTimersRecursively(fiber['return']);
        }
        if (fiber._debugIsCurrentlyTiming) {
          beginFiberMark(fiber, null);
        }
      };
      var resumeTimers = function() {
        if (currentFiber !== null) {
          resumeTimersRecursively(currentFiber);
        }
      };
      function recordEffect() {
        if (enableUserTimingAPI) {
          effectCountInCurrentCommit++;
        }
      }
      function recordScheduleUpdate() {
        if (enableUserTimingAPI) {
          if (isCommitting) {
            hasScheduledUpdateInCurrentCommit = true;
          }
          if (currentPhase !== null && currentPhase !== 'componentWillMount' && currentPhase !== 'componentWillReceiveProps') {
            hasScheduledUpdateInCurrentPhase = true;
          }
        }
      }
      function startWorkTimer(fiber) {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
            return;
          }
          currentFiber = fiber;
          if (!beginFiberMark(fiber, null)) {
            return;
          }
          fiber._debugIsCurrentlyTiming = true;
        }
      }
      function cancelWorkTimer(fiber) {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
            return;
          }
          fiber._debugIsCurrentlyTiming = false;
          clearFiberMark(fiber, null);
        }
      }
      function stopWorkTimer(fiber) {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
            return;
          }
          currentFiber = fiber['return'];
          if (!fiber._debugIsCurrentlyTiming) {
            return;
          }
          fiber._debugIsCurrentlyTiming = false;
          endFiberMark(fiber, null, null);
        }
      }
      function stopFailedWorkTimer(fiber) {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
            return;
          }
          currentFiber = fiber['return'];
          if (!fiber._debugIsCurrentlyTiming) {
            return;
          }
          fiber._debugIsCurrentlyTiming = false;
          var warning$$1 = 'An error was thrown inside this error boundary';
          endFiberMark(fiber, null, warning$$1);
        }
      }
      function startPhaseTimer(fiber, phase) {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming) {
            return;
          }
          clearPendingPhaseMeasurement();
          if (!beginFiberMark(fiber, phase)) {
            return;
          }
          currentPhaseFiber = fiber;
          currentPhase = phase;
        }
      }
      function stopPhaseTimer() {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming) {
            return;
          }
          if (currentPhase !== null && currentPhaseFiber !== null) {
            var warning$$1 = hasScheduledUpdateInCurrentPhase ? 'Scheduled a cascading update' : null;
            endFiberMark(currentPhaseFiber, currentPhase, warning$$1);
          }
          currentPhase = null;
          currentPhaseFiber = null;
        }
      }
      function startWorkLoopTimer(nextUnitOfWork) {
        if (enableUserTimingAPI) {
          currentFiber = nextUnitOfWork;
          if (!supportsUserTiming) {
            return;
          }
          commitCountInCurrentWorkLoop = 0;
          beginMark('(React Tree Reconciliation)');
          resumeTimers();
        }
      }
      function stopWorkLoopTimer(interruptedBy) {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming) {
            return;
          }
          var warning$$1 = null;
          if (interruptedBy !== null) {
            if (interruptedBy.tag === HostRoot) {
              warning$$1 = 'A top-level update interrupted the previous render';
            } else {
              var componentName = getComponentName(interruptedBy) || 'Unknown';
              warning$$1 = 'An update to ' + componentName + ' interrupted the previous render';
            }
          } else if (commitCountInCurrentWorkLoop > 1) {
            warning$$1 = 'There were cascading updates';
          }
          commitCountInCurrentWorkLoop = 0;
          pauseTimers();
          endMark('(React Tree Reconciliation)', '(React Tree Reconciliation)', warning$$1);
        }
      }
      function startCommitTimer() {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming) {
            return;
          }
          isCommitting = true;
          hasScheduledUpdateInCurrentCommit = false;
          labelsInCurrentCommit.clear();
          beginMark('(Committing Changes)');
        }
      }
      function stopCommitTimer() {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming) {
            return;
          }
          var warning$$1 = null;
          if (hasScheduledUpdateInCurrentCommit) {
            warning$$1 = 'Lifecycle hook scheduled a cascading update';
          } else if (commitCountInCurrentWorkLoop > 0) {
            warning$$1 = 'Caused by a cascading update in earlier commit';
          }
          hasScheduledUpdateInCurrentCommit = false;
          commitCountInCurrentWorkLoop++;
          isCommitting = false;
          labelsInCurrentCommit.clear();
          endMark('(Committing Changes)', '(Committing Changes)', warning$$1);
        }
      }
      function startCommitHostEffectsTimer() {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming) {
            return;
          }
          effectCountInCurrentCommit = 0;
          beginMark('(Committing Host Effects)');
        }
      }
      function stopCommitHostEffectsTimer() {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming) {
            return;
          }
          var count = effectCountInCurrentCommit;
          effectCountInCurrentCommit = 0;
          endMark('(Committing Host Effects: ' + count + ' Total)', '(Committing Host Effects)', null);
        }
      }
      function startCommitLifeCyclesTimer() {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming) {
            return;
          }
          effectCountInCurrentCommit = 0;
          beginMark('(Calling Lifecycle Methods)');
        }
      }
      function stopCommitLifeCyclesTimer() {
        if (enableUserTimingAPI) {
          if (!supportsUserTiming) {
            return;
          }
          var count = effectCountInCurrentCommit;
          effectCountInCurrentCommit = 0;
          endMark('(Calling Lifecycle Methods: ' + count + ' Total)', '(Calling Lifecycle Methods)', null);
        }
      }
      {
        var warnedAboutMissingGetChildContext = {};
      }
      var contextStackCursor = createCursor(emptyObject);
      var didPerformWorkStackCursor = createCursor(false);
      var previousContext = emptyObject;
      function getUnmaskedContext(workInProgress) {
        var hasOwnContext = isContextProvider(workInProgress);
        if (hasOwnContext) {
          return previousContext;
        }
        return contextStackCursor.current;
      }
      function cacheContext(workInProgress, unmaskedContext, maskedContext) {
        var instance = workInProgress.stateNode;
        instance.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext;
        instance.__reactInternalMemoizedMaskedChildContext = maskedContext;
      }
      function getMaskedContext(workInProgress, unmaskedContext) {
        var type = workInProgress.type;
        var contextTypes = type.contextTypes;
        if (!contextTypes) {
          return emptyObject;
        }
        var instance = workInProgress.stateNode;
        if (instance && instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext) {
          return instance.__reactInternalMemoizedMaskedChildContext;
        }
        var context = {};
        for (var key in contextTypes) {
          context[key] = unmaskedContext[key];
        }
        {
          var name = getComponentName(workInProgress) || 'Unknown';
          checkPropTypes(contextTypes, context, 'context', name, ReactDebugCurrentFiber.getCurrentFiberStackAddendum);
        }
        if (instance) {
          cacheContext(workInProgress, unmaskedContext, context);
        }
        return context;
      }
      function hasContextChanged() {
        return didPerformWorkStackCursor.current;
      }
      function isContextConsumer(fiber) {
        return fiber.tag === ClassComponent && fiber.type.contextTypes != null;
      }
      function isContextProvider(fiber) {
        return fiber.tag === ClassComponent && fiber.type.childContextTypes != null;
      }
      function popContextProvider(fiber) {
        if (!isContextProvider(fiber)) {
          return;
        }
        pop(didPerformWorkStackCursor, fiber);
        pop(contextStackCursor, fiber);
      }
      function popTopLevelContextObject(fiber) {
        pop(didPerformWorkStackCursor, fiber);
        pop(contextStackCursor, fiber);
      }
      function pushTopLevelContextObject(fiber, context, didChange) {
        !(contextStackCursor.cursor == null) ? invariant(false, 'Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.') : void 0;
        push(contextStackCursor, context, fiber);
        push(didPerformWorkStackCursor, didChange, fiber);
      }
      function processChildContext(fiber, parentContext) {
        var instance = fiber.stateNode;
        var childContextTypes = fiber.type.childContextTypes;
        if (typeof instance.getChildContext !== 'function') {
          {
            var componentName = getComponentName(fiber) || 'Unknown';
            if (!warnedAboutMissingGetChildContext[componentName]) {
              warnedAboutMissingGetChildContext[componentName] = true;
              warning(false, '%s.childContextTypes is specified but there is no getChildContext() method ' + 'on the instance. You can either define getChildContext() on %s or remove ' + 'childContextTypes from it.', componentName, componentName);
            }
          }
          return parentContext;
        }
        var childContext = void 0;
        {
          ReactDebugCurrentFiber.setCurrentPhase('getChildContext');
        }
        startPhaseTimer(fiber, 'getChildContext');
        childContext = instance.getChildContext();
        stopPhaseTimer();
        {
          ReactDebugCurrentFiber.setCurrentPhase(null);
        }
        for (var contextKey in childContext) {
          !(contextKey in childContextTypes) ? invariant(false, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', getComponentName(fiber) || 'Unknown', contextKey) : void 0;
        }
        {
          var name = getComponentName(fiber) || 'Unknown';
          checkPropTypes(childContextTypes, childContext, 'child context', name, ReactDebugCurrentFiber.getCurrentFiberStackAddendum);
        }
        return _assign({}, parentContext, childContext);
      }
      function pushContextProvider(workInProgress) {
        if (!isContextProvider(workInProgress)) {
          return false;
        }
        var instance = workInProgress.stateNode;
        var memoizedMergedChildContext = instance && instance.__reactInternalMemoizedMergedChildContext || emptyObject;
        previousContext = contextStackCursor.current;
        push(contextStackCursor, memoizedMergedChildContext, workInProgress);
        push(didPerformWorkStackCursor, didPerformWorkStackCursor.current, workInProgress);
        return true;
      }
      function invalidateContextProvider(workInProgress, didChange) {
        var instance = workInProgress.stateNode;
        !instance ? invariant(false, 'Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.') : void 0;
        if (didChange) {
          var mergedContext = processChildContext(workInProgress, previousContext);
          instance.__reactInternalMemoizedMergedChildContext = mergedContext;
          pop(didPerformWorkStackCursor, workInProgress);
          pop(contextStackCursor, workInProgress);
          push(contextStackCursor, mergedContext, workInProgress);
          push(didPerformWorkStackCursor, didChange, workInProgress);
        } else {
          pop(didPerformWorkStackCursor, workInProgress);
          push(didPerformWorkStackCursor, didChange, workInProgress);
        }
      }
      function resetContext() {
        previousContext = emptyObject;
        contextStackCursor.current = emptyObject;
        didPerformWorkStackCursor.current = false;
      }
      function findCurrentUnmaskedContext(fiber) {
        !(isFiberMounted(fiber) && fiber.tag === ClassComponent) ? invariant(false, 'Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.') : void 0;
        var node = fiber;
        while (node.tag !== HostRoot) {
          if (isContextProvider(node)) {
            return node.stateNode.__reactInternalMemoizedMergedChildContext;
          }
          var parent = node['return'];
          !parent ? invariant(false, 'Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          node = parent;
        }
        return node.stateNode.context;
      }
      var NoWork = 0;
      var Sync = 1;
      var Never = 2147483647;
      var UNIT_SIZE = 10;
      var MAGIC_NUMBER_OFFSET = 2;
      function msToExpirationTime(ms) {
        return (ms / UNIT_SIZE | 0) + MAGIC_NUMBER_OFFSET;
      }
      function ceiling(num, precision) {
        return ((num / precision | 0) + 1) * precision;
      }
      function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
        return ceiling(currentTime + expirationInMs / UNIT_SIZE, bucketSizeMs / UNIT_SIZE);
      }
      var NoContext = 0;
      var AsyncUpdates = 1;
      {
        var hasBadMapPolyfill = false;
        try {
          var nonExtensibleObject = Object.preventExtensions({});
          new Map([[nonExtensibleObject, null]]);
          new Set([nonExtensibleObject]);
        } catch (e) {
          hasBadMapPolyfill = true;
        }
      }
      {
        var debugCounter = 1;
      }
      function FiberNode(tag, key, internalContextTag) {
        this.tag = tag;
        this.key = key;
        this.type = null;
        this.stateNode = null;
        this['return'] = null;
        this.child = null;
        this.sibling = null;
        this.index = 0;
        this.ref = null;
        this.pendingProps = null;
        this.memoizedProps = null;
        this.updateQueue = null;
        this.memoizedState = null;
        this.internalContextTag = internalContextTag;
        this.effectTag = NoEffect;
        this.nextEffect = null;
        this.firstEffect = null;
        this.lastEffect = null;
        this.expirationTime = NoWork;
        this.alternate = null;
        {
          this._debugID = debugCounter++;
          this._debugSource = null;
          this._debugOwner = null;
          this._debugIsCurrentlyTiming = false;
          if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
            Object.preventExtensions(this);
          }
        }
      }
      var createFiber = function(tag, key, internalContextTag) {
        return new FiberNode(tag, key, internalContextTag);
      };
      function shouldConstruct(Component) {
        return !!(Component.prototype && Component.prototype.isReactComponent);
      }
      function createWorkInProgress(current, pendingProps, expirationTime) {
        var workInProgress = current.alternate;
        if (workInProgress === null) {
          workInProgress = createFiber(current.tag, current.key, current.internalContextTag);
          workInProgress.type = current.type;
          workInProgress.stateNode = current.stateNode;
          {
            workInProgress._debugID = current._debugID;
            workInProgress._debugSource = current._debugSource;
            workInProgress._debugOwner = current._debugOwner;
          }
          workInProgress.alternate = current;
          current.alternate = workInProgress;
        } else {
          workInProgress.effectTag = NoEffect;
          workInProgress.nextEffect = null;
          workInProgress.firstEffect = null;
          workInProgress.lastEffect = null;
        }
        workInProgress.expirationTime = expirationTime;
        workInProgress.pendingProps = pendingProps;
        workInProgress.child = current.child;
        workInProgress.memoizedProps = current.memoizedProps;
        workInProgress.memoizedState = current.memoizedState;
        workInProgress.updateQueue = current.updateQueue;
        workInProgress.sibling = current.sibling;
        workInProgress.index = current.index;
        workInProgress.ref = current.ref;
        return workInProgress;
      }
      function createHostRootFiber() {
        var fiber = createFiber(HostRoot, null, NoContext);
        return fiber;
      }
      function createFiberFromElement(element, internalContextTag, expirationTime) {
        var owner = null;
        {
          owner = element._owner;
        }
        var fiber = void 0;
        var type = element.type,
            key = element.key;
        if (typeof type === 'function') {
          fiber = shouldConstruct(type) ? createFiber(ClassComponent, key, internalContextTag) : createFiber(IndeterminateComponent, key, internalContextTag);
          fiber.type = type;
          fiber.pendingProps = element.props;
        } else if (typeof type === 'string') {
          fiber = createFiber(HostComponent, key, internalContextTag);
          fiber.type = type;
          fiber.pendingProps = element.props;
        } else if (typeof type === 'object' && type !== null && typeof type.tag === 'number') {
          fiber = type;
          fiber.pendingProps = element.props;
        } else {
          var info = '';
          {
            if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
              info += ' You likely forgot to export your component from the file ' + "it's defined in.";
            }
            var ownerName = owner ? getComponentName(owner) : null;
            if (ownerName) {
              info += '\n\nCheck the render method of `' + ownerName + '`.';
            }
          }
          invariant(false, 'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s', type == null ? type : typeof type, info);
        }
        {
          fiber._debugSource = element._source;
          fiber._debugOwner = element._owner;
        }
        fiber.expirationTime = expirationTime;
        return fiber;
      }
      function createFiberFromFragment(elements, internalContextTag, expirationTime, key) {
        var fiber = createFiber(Fragment, key, internalContextTag);
        fiber.pendingProps = elements;
        fiber.expirationTime = expirationTime;
        return fiber;
      }
      function createFiberFromText(content, internalContextTag, expirationTime) {
        var fiber = createFiber(HostText, null, internalContextTag);
        fiber.pendingProps = content;
        fiber.expirationTime = expirationTime;
        return fiber;
      }
      function createFiberFromHostInstanceForDeletion() {
        var fiber = createFiber(HostComponent, null, NoContext);
        fiber.type = 'DELETED';
        return fiber;
      }
      function createFiberFromCall(call, internalContextTag, expirationTime) {
        var fiber = createFiber(CallComponent, call.key, internalContextTag);
        fiber.type = call.handler;
        fiber.pendingProps = call;
        fiber.expirationTime = expirationTime;
        return fiber;
      }
      function createFiberFromReturn(returnNode, internalContextTag, expirationTime) {
        var fiber = createFiber(ReturnComponent, null, internalContextTag);
        fiber.expirationTime = expirationTime;
        return fiber;
      }
      function createFiberFromPortal(portal, internalContextTag, expirationTime) {
        var fiber = createFiber(HostPortal, portal.key, internalContextTag);
        fiber.pendingProps = portal.children || [];
        fiber.expirationTime = expirationTime;
        fiber.stateNode = {
          containerInfo: portal.containerInfo,
          pendingChildren: null,
          implementation: portal.implementation
        };
        return fiber;
      }
      function createFiberRoot(containerInfo, hydrate) {
        var uninitializedFiber = createHostRootFiber();
        var root = {
          current: uninitializedFiber,
          containerInfo: containerInfo,
          pendingChildren: null,
          remainingExpirationTime: NoWork,
          isReadyForCommit: false,
          finishedWork: null,
          context: null,
          pendingContext: null,
          hydrate: hydrate,
          nextScheduledRoot: null
        };
        uninitializedFiber.stateNode = root;
        return root;
      }
      var onCommitFiberRoot = null;
      var onCommitFiberUnmount = null;
      var hasLoggedError = false;
      function catchErrors(fn) {
        return function(arg) {
          try {
            return fn(arg);
          } catch (err) {
            if (true && !hasLoggedError) {
              hasLoggedError = true;
              warning(false, 'React DevTools encountered an error: %s', err);
            }
          }
        };
      }
      function injectInternals(internals) {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
          return false;
        }
        var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (hook.isDisabled) {
          return true;
        }
        if (!hook.supportsFiber) {
          {
            warning(false, 'The installed version of React DevTools is too old and will not work ' + 'with the current version of React. Please update React DevTools. ' + 'https://fb.me/react-devtools');
          }
          return true;
        }
        try {
          var rendererID = hook.inject(internals);
          onCommitFiberRoot = catchErrors(function(root) {
            return hook.onCommitFiberRoot(rendererID, root);
          });
          onCommitFiberUnmount = catchErrors(function(fiber) {
            return hook.onCommitFiberUnmount(rendererID, fiber);
          });
        } catch (err) {
          {
            warning(false, 'React DevTools encountered an error: %s.', err);
          }
        }
        return true;
      }
      function onCommitRoot(root) {
        if (typeof onCommitFiberRoot === 'function') {
          onCommitFiberRoot(root);
        }
      }
      function onCommitUnmount(fiber) {
        if (typeof onCommitFiberUnmount === 'function') {
          onCommitFiberUnmount(fiber);
        }
      }
      {
        var didWarnUpdateInsideUpdate = false;
      }
      function createUpdateQueue(baseState) {
        var queue = {
          baseState: baseState,
          expirationTime: NoWork,
          first: null,
          last: null,
          callbackList: null,
          hasForceUpdate: false,
          isInitialized: false
        };
        {
          queue.isProcessing = false;
        }
        return queue;
      }
      function insertUpdateIntoQueue(queue, update) {
        if (queue.last === null) {
          queue.first = queue.last = update;
        } else {
          queue.last.next = update;
          queue.last = update;
        }
        if (queue.expirationTime === NoWork || queue.expirationTime > update.expirationTime) {
          queue.expirationTime = update.expirationTime;
        }
      }
      function insertUpdateIntoFiber(fiber, update) {
        var alternateFiber = fiber.alternate;
        var queue1 = fiber.updateQueue;
        if (queue1 === null) {
          queue1 = fiber.updateQueue = createUpdateQueue(null);
        }
        var queue2 = void 0;
        if (alternateFiber !== null) {
          queue2 = alternateFiber.updateQueue;
          if (queue2 === null) {
            queue2 = alternateFiber.updateQueue = createUpdateQueue(null);
          }
        } else {
          queue2 = null;
        }
        queue2 = queue2 !== queue1 ? queue2 : null;
        {
          if ((queue1.isProcessing || queue2 !== null && queue2.isProcessing) && !didWarnUpdateInsideUpdate) {
            warning(false, 'An update (setState, replaceState, or forceUpdate) was scheduled ' + 'from inside an update function. Update functions should be pure, ' + 'with zero side-effects. Consider using componentDidUpdate or a ' + 'callback.');
            didWarnUpdateInsideUpdate = true;
          }
        }
        if (queue2 === null) {
          insertUpdateIntoQueue(queue1, update);
          return;
        }
        if (queue1.last === null || queue2.last === null) {
          insertUpdateIntoQueue(queue1, update);
          insertUpdateIntoQueue(queue2, update);
          return;
        }
        insertUpdateIntoQueue(queue1, update);
        queue2.last = update;
      }
      function getUpdateExpirationTime(fiber) {
        if (fiber.tag !== ClassComponent && fiber.tag !== HostRoot) {
          return NoWork;
        }
        var updateQueue = fiber.updateQueue;
        if (updateQueue === null) {
          return NoWork;
        }
        return updateQueue.expirationTime;
      }
      function getStateFromUpdate(update, instance, prevState, props) {
        var partialState = update.partialState;
        if (typeof partialState === 'function') {
          var updateFn = partialState;
          return updateFn.call(instance, prevState, props);
        } else {
          return partialState;
        }
      }
      function processUpdateQueue(current, workInProgress, queue, instance, props, renderExpirationTime) {
        if (current !== null && current.updateQueue === queue) {
          var currentQueue = queue;
          queue = workInProgress.updateQueue = {
            baseState: currentQueue.baseState,
            expirationTime: currentQueue.expirationTime,
            first: currentQueue.first,
            last: currentQueue.last,
            isInitialized: currentQueue.isInitialized,
            callbackList: null,
            hasForceUpdate: false
          };
        }
        {
          queue.isProcessing = true;
        }
        queue.expirationTime = NoWork;
        var state = void 0;
        if (queue.isInitialized) {
          state = queue.baseState;
        } else {
          state = queue.baseState = workInProgress.memoizedState;
          queue.isInitialized = true;
        }
        var dontMutatePrevState = true;
        var update = queue.first;
        var didSkip = false;
        while (update !== null) {
          var updateExpirationTime = update.expirationTime;
          if (updateExpirationTime > renderExpirationTime) {
            var remainingExpirationTime = queue.expirationTime;
            if (remainingExpirationTime === NoWork || remainingExpirationTime > updateExpirationTime) {
              queue.expirationTime = updateExpirationTime;
            }
            if (!didSkip) {
              didSkip = true;
              queue.baseState = state;
            }
            update = update.next;
            continue;
          }
          if (!didSkip) {
            queue.first = update.next;
            if (queue.first === null) {
              queue.last = null;
            }
          }
          var _partialState = void 0;
          if (update.isReplace) {
            state = getStateFromUpdate(update, instance, state, props);
            dontMutatePrevState = true;
          } else {
            _partialState = getStateFromUpdate(update, instance, state, props);
            if (_partialState) {
              if (dontMutatePrevState) {
                state = _assign({}, state, _partialState);
              } else {
                state = _assign(state, _partialState);
              }
              dontMutatePrevState = false;
            }
          }
          if (update.isForced) {
            queue.hasForceUpdate = true;
          }
          if (update.callback !== null) {
            var _callbackList = queue.callbackList;
            if (_callbackList === null) {
              _callbackList = queue.callbackList = [];
            }
            _callbackList.push(update);
          }
          update = update.next;
        }
        if (queue.callbackList !== null) {
          workInProgress.effectTag |= Callback;
        } else if (queue.first === null && !queue.hasForceUpdate) {
          workInProgress.updateQueue = null;
        }
        if (!didSkip) {
          didSkip = true;
          queue.baseState = state;
        }
        {
          queue.isProcessing = false;
        }
        return state;
      }
      function commitCallbacks(queue, context) {
        var callbackList = queue.callbackList;
        if (callbackList === null) {
          return;
        }
        queue.callbackList = null;
        for (var i = 0; i < callbackList.length; i++) {
          var update = callbackList[i];
          var _callback = update.callback;
          update.callback = null;
          !(typeof _callback === 'function') ? invariant(false, 'Invalid argument passed as callback. Expected a function. Instead received: %s', _callback) : void 0;
          _callback.call(context);
        }
      }
      var fakeInternalInstance = {};
      var isArray = Array.isArray;
      {
        var didWarnAboutStateAssignmentForComponent = {};
        var warnOnInvalidCallback = function(callback, callerName) {
          warning(callback === null || typeof callback === 'function', '%s(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callerName, callback);
        };
        Object.defineProperty(fakeInternalInstance, '_processChildContext', {
          enumerable: false,
          value: function() {
            invariant(false, '_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn\'t supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).');
          }
        });
        Object.freeze(fakeInternalInstance);
      }
      var ReactFiberClassComponent = function(scheduleWork, computeExpirationForFiber, memoizeProps, memoizeState) {
        var updater = {
          isMounted: isMounted,
          enqueueSetState: function(instance, partialState, callback) {
            var fiber = get(instance);
            callback = callback === undefined ? null : callback;
            {
              warnOnInvalidCallback(callback, 'setState');
            }
            var expirationTime = computeExpirationForFiber(fiber);
            var update = {
              expirationTime: expirationTime,
              partialState: partialState,
              callback: callback,
              isReplace: false,
              isForced: false,
              nextCallback: null,
              next: null
            };
            insertUpdateIntoFiber(fiber, update);
            scheduleWork(fiber, expirationTime);
          },
          enqueueReplaceState: function(instance, state, callback) {
            var fiber = get(instance);
            callback = callback === undefined ? null : callback;
            {
              warnOnInvalidCallback(callback, 'replaceState');
            }
            var expirationTime = computeExpirationForFiber(fiber);
            var update = {
              expirationTime: expirationTime,
              partialState: state,
              callback: callback,
              isReplace: true,
              isForced: false,
              nextCallback: null,
              next: null
            };
            insertUpdateIntoFiber(fiber, update);
            scheduleWork(fiber, expirationTime);
          },
          enqueueForceUpdate: function(instance, callback) {
            var fiber = get(instance);
            callback = callback === undefined ? null : callback;
            {
              warnOnInvalidCallback(callback, 'forceUpdate');
            }
            var expirationTime = computeExpirationForFiber(fiber);
            var update = {
              expirationTime: expirationTime,
              partialState: null,
              callback: callback,
              isReplace: false,
              isForced: true,
              nextCallback: null,
              next: null
            };
            insertUpdateIntoFiber(fiber, update);
            scheduleWork(fiber, expirationTime);
          }
        };
        function checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState, newContext) {
          if (oldProps === null || workInProgress.updateQueue !== null && workInProgress.updateQueue.hasForceUpdate) {
            return true;
          }
          var instance = workInProgress.stateNode;
          var type = workInProgress.type;
          if (typeof instance.shouldComponentUpdate === 'function') {
            startPhaseTimer(workInProgress, 'shouldComponentUpdate');
            var shouldUpdate = instance.shouldComponentUpdate(newProps, newState, newContext);
            stopPhaseTimer();
            {
              warning(shouldUpdate !== undefined, '%s.shouldComponentUpdate(): Returned undefined instead of a ' + 'boolean value. Make sure to return true or false.', getComponentName(workInProgress) || 'Unknown');
            }
            return shouldUpdate;
          }
          if (type.prototype && type.prototype.isPureReactComponent) {
            return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
          }
          return true;
        }
        function checkClassInstance(workInProgress) {
          var instance = workInProgress.stateNode;
          var type = workInProgress.type;
          {
            var name = getComponentName(workInProgress);
            var renderPresent = instance.render;
            if (!renderPresent) {
              if (type.prototype && typeof type.prototype.render === 'function') {
                warning(false, '%s(...): No `render` method found on the returned component ' + 'instance: did you accidentally return an object from the constructor?', name);
              } else {
                warning(false, '%s(...): No `render` method found on the returned component ' + 'instance: you may have forgotten to define `render`.', name);
              }
            }
            var noGetInitialStateOnES6 = !instance.getInitialState || instance.getInitialState.isReactClassApproved || instance.state;
            warning(noGetInitialStateOnES6, 'getInitialState was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Did you mean to define a state property instead?', name);
            var noGetDefaultPropsOnES6 = !instance.getDefaultProps || instance.getDefaultProps.isReactClassApproved;
            warning(noGetDefaultPropsOnES6, 'getDefaultProps was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Use a static property to define defaultProps instead.', name);
            var noInstancePropTypes = !instance.propTypes;
            warning(noInstancePropTypes, 'propTypes was defined as an instance property on %s. Use a static ' + 'property to define propTypes instead.', name);
            var noInstanceContextTypes = !instance.contextTypes;
            warning(noInstanceContextTypes, 'contextTypes was defined as an instance property on %s. Use a static ' + 'property to define contextTypes instead.', name);
            var noComponentShouldUpdate = typeof instance.componentShouldUpdate !== 'function';
            warning(noComponentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', name);
            if (type.prototype && type.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== 'undefined') {
              warning(false, '%s has a method called shouldComponentUpdate(). ' + 'shouldComponentUpdate should not be used when extending React.PureComponent. ' + 'Please extend React.Component if shouldComponentUpdate is used.', getComponentName(workInProgress) || 'A pure component');
            }
            var noComponentDidUnmount = typeof instance.componentDidUnmount !== 'function';
            warning(noComponentDidUnmount, '%s has a method called ' + 'componentDidUnmount(). But there is no such lifecycle method. ' + 'Did you mean componentWillUnmount()?', name);
            var noComponentDidReceiveProps = typeof instance.componentDidReceiveProps !== 'function';
            warning(noComponentDidReceiveProps, '%s has a method called ' + 'componentDidReceiveProps(). But there is no such lifecycle method. ' + 'If you meant to update the state in response to changing props, ' + 'use componentWillReceiveProps(). If you meant to fetch data or ' + 'run side-effects or mutations after React has updated the UI, use componentDidUpdate().', name);
            var noComponentWillRecieveProps = typeof instance.componentWillRecieveProps !== 'function';
            warning(noComponentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', name);
            var hasMutatedProps = instance.props !== workInProgress.pendingProps;
            warning(instance.props === undefined || !hasMutatedProps, '%s(...): When calling super() in `%s`, make sure to pass ' + "up the same props that your component's constructor was passed.", name, name);
            var noInstanceDefaultProps = !instance.defaultProps;
            warning(noInstanceDefaultProps, 'Setting defaultProps as an instance property on %s is not supported and will be ignored.' + ' Instead, define defaultProps as a static property on %s.', name, name);
          }
          var state = instance.state;
          if (state && (typeof state !== 'object' || isArray(state))) {
            invariant(false, '%s.state: must be set to an object or null', getComponentName(workInProgress));
          }
          if (typeof instance.getChildContext === 'function') {
            !(typeof workInProgress.type.childContextTypes === 'object') ? invariant(false, '%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().', getComponentName(workInProgress)) : void 0;
          }
        }
        function resetInputPointers(workInProgress, instance) {
          instance.props = workInProgress.memoizedProps;
          instance.state = workInProgress.memoizedState;
        }
        function adoptClassInstance(workInProgress, instance) {
          instance.updater = updater;
          workInProgress.stateNode = instance;
          set(instance, workInProgress);
          {
            instance._reactInternalInstance = fakeInternalInstance;
          }
        }
        function constructClassInstance(workInProgress, props) {
          var ctor = workInProgress.type;
          var unmaskedContext = getUnmaskedContext(workInProgress);
          var needsContext = isContextConsumer(workInProgress);
          var context = needsContext ? getMaskedContext(workInProgress, unmaskedContext) : emptyObject;
          var instance = new ctor(props, context);
          adoptClassInstance(workInProgress, instance);
          if (needsContext) {
            cacheContext(workInProgress, unmaskedContext, context);
          }
          return instance;
        }
        function callComponentWillMount(workInProgress, instance) {
          startPhaseTimer(workInProgress, 'componentWillMount');
          var oldState = instance.state;
          instance.componentWillMount();
          stopPhaseTimer();
          if (oldState !== instance.state) {
            {
              warning(false, '%s.componentWillMount(): Assigning directly to this.state is ' + "deprecated (except inside a component's " + 'constructor). Use setState instead.', getComponentName(workInProgress));
            }
            updater.enqueueReplaceState(instance, instance.state, null);
          }
        }
        function callComponentWillReceiveProps(workInProgress, instance, newProps, newContext) {
          startPhaseTimer(workInProgress, 'componentWillReceiveProps');
          var oldState = instance.state;
          instance.componentWillReceiveProps(newProps, newContext);
          stopPhaseTimer();
          if (instance.state !== oldState) {
            {
              var componentName = getComponentName(workInProgress) || 'Component';
              if (!didWarnAboutStateAssignmentForComponent[componentName]) {
                warning(false, '%s.componentWillReceiveProps(): Assigning directly to ' + "this.state is deprecated (except inside a component's " + 'constructor). Use setState instead.', componentName);
                didWarnAboutStateAssignmentForComponent[componentName] = true;
              }
            }
            updater.enqueueReplaceState(instance, instance.state, null);
          }
        }
        function mountClassInstance(workInProgress, renderExpirationTime) {
          var current = workInProgress.alternate;
          {
            checkClassInstance(workInProgress);
          }
          var instance = workInProgress.stateNode;
          var state = instance.state || null;
          var props = workInProgress.pendingProps;
          !props ? invariant(false, 'There must be pending props for an initial mount. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          var unmaskedContext = getUnmaskedContext(workInProgress);
          instance.props = props;
          instance.state = workInProgress.memoizedState = state;
          instance.refs = emptyObject;
          instance.context = getMaskedContext(workInProgress, unmaskedContext);
          if (enableAsyncSubtreeAPI && workInProgress.type != null && workInProgress.type.prototype != null && workInProgress.type.prototype.unstable_isAsyncReactComponent === true) {
            workInProgress.internalContextTag |= AsyncUpdates;
          }
          if (typeof instance.componentWillMount === 'function') {
            callComponentWillMount(workInProgress, instance);
            var updateQueue = workInProgress.updateQueue;
            if (updateQueue !== null) {
              instance.state = processUpdateQueue(current, workInProgress, updateQueue, instance, props, renderExpirationTime);
            }
          }
          if (typeof instance.componentDidMount === 'function') {
            workInProgress.effectTag |= Update;
          }
        }
        function updateClassInstance(current, workInProgress, renderExpirationTime) {
          var instance = workInProgress.stateNode;
          resetInputPointers(workInProgress, instance);
          var oldProps = workInProgress.memoizedProps;
          var newProps = workInProgress.pendingProps;
          if (!newProps) {
            newProps = oldProps;
            !(newProps != null) ? invariant(false, 'There should always be pending or memoized props. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          }
          var oldContext = instance.context;
          var newUnmaskedContext = getUnmaskedContext(workInProgress);
          var newContext = getMaskedContext(workInProgress, newUnmaskedContext);
          if (typeof instance.componentWillReceiveProps === 'function' && (oldProps !== newProps || oldContext !== newContext)) {
            callComponentWillReceiveProps(workInProgress, instance, newProps, newContext);
          }
          var oldState = workInProgress.memoizedState;
          var newState = void 0;
          if (workInProgress.updateQueue !== null) {
            newState = processUpdateQueue(current, workInProgress, workInProgress.updateQueue, instance, newProps, renderExpirationTime);
          } else {
            newState = oldState;
          }
          if (oldProps === newProps && oldState === newState && !hasContextChanged() && !(workInProgress.updateQueue !== null && workInProgress.updateQueue.hasForceUpdate)) {
            if (typeof instance.componentDidUpdate === 'function') {
              if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
                workInProgress.effectTag |= Update;
              }
            }
            return false;
          }
          var shouldUpdate = checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState, newContext);
          if (shouldUpdate) {
            if (typeof instance.componentWillUpdate === 'function') {
              startPhaseTimer(workInProgress, 'componentWillUpdate');
              instance.componentWillUpdate(newProps, newState, newContext);
              stopPhaseTimer();
            }
            if (typeof instance.componentDidUpdate === 'function') {
              workInProgress.effectTag |= Update;
            }
          } else {
            if (typeof instance.componentDidUpdate === 'function') {
              if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
                workInProgress.effectTag |= Update;
              }
            }
            memoizeProps(workInProgress, newProps);
            memoizeState(workInProgress, newState);
          }
          instance.props = newProps;
          instance.state = newState;
          instance.context = newContext;
          return shouldUpdate;
        }
        return {
          adoptClassInstance: adoptClassInstance,
          constructClassInstance: constructClassInstance,
          mountClassInstance: mountClassInstance,
          updateClassInstance: updateClassInstance
        };
      };
      var REACT_PORTAL_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.portal') || 0xeaca;
      function createPortal$1(children, containerInfo, implementation) {
        var key = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        return {
          $$typeof: REACT_PORTAL_TYPE,
          key: key == null ? null : '' + key,
          children: children,
          containerInfo: containerInfo,
          implementation: implementation
        };
      }
      var getCurrentFiberStackAddendum$1 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;
      {
        var didWarnAboutMaps = false;
        var ownerHasKeyUseWarning = {};
        var ownerHasFunctionTypeWarning = {};
        var warnForMissingKey = function(child) {
          if (child === null || typeof child !== 'object') {
            return;
          }
          if (!child._store || child._store.validated || child.key != null) {
            return;
          }
          !(typeof child._store === 'object') ? invariant(false, 'React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          child._store.validated = true;
          var currentComponentErrorInfo = 'Each child in an array or iterator should have a unique ' + '"key" prop. See https://fb.me/react-warning-keys for ' + 'more information.' + (getCurrentFiberStackAddendum$1() || '');
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          warning(false, 'Each child in an array or iterator should have a unique ' + '"key" prop. See https://fb.me/react-warning-keys for ' + 'more information.%s', getCurrentFiberStackAddendum$1());
        };
      }
      var isArray$1 = Array.isArray;
      var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator';
      var REACT_ELEMENT_TYPE;
      var REACT_CALL_TYPE;
      var REACT_RETURN_TYPE;
      var REACT_FRAGMENT_TYPE;
      if (typeof Symbol === 'function' && Symbol['for']) {
        REACT_ELEMENT_TYPE = Symbol['for']('react.element');
        REACT_CALL_TYPE = Symbol['for']('react.call');
        REACT_RETURN_TYPE = Symbol['for']('react.return');
        REACT_FRAGMENT_TYPE = Symbol['for']('react.fragment');
      } else {
        REACT_ELEMENT_TYPE = 0xeac7;
        REACT_CALL_TYPE = 0xeac8;
        REACT_RETURN_TYPE = 0xeac9;
        REACT_FRAGMENT_TYPE = 0xeacb;
      }
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable === 'undefined') {
          return null;
        }
        var iteratorFn = ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof iteratorFn === 'function') {
          return iteratorFn;
        }
        return null;
      }
      function coerceRef(current, element) {
        var mixedRef = element.ref;
        if (mixedRef !== null && typeof mixedRef !== 'function') {
          if (element._owner) {
            var owner = element._owner;
            var inst = void 0;
            if (owner) {
              var ownerFiber = owner;
              !(ownerFiber.tag === ClassComponent) ? invariant(false, 'Stateless function components cannot have refs.') : void 0;
              inst = ownerFiber.stateNode;
            }
            !inst ? invariant(false, 'Missing owner for string ref %s. This error is likely caused by a bug in React. Please file an issue.', mixedRef) : void 0;
            var stringRef = '' + mixedRef;
            if (current !== null && current.ref !== null && current.ref._stringRef === stringRef) {
              return current.ref;
            }
            var ref = function(value) {
              var refs = inst.refs === emptyObject ? inst.refs = {} : inst.refs;
              if (value === null) {
                delete refs[stringRef];
              } else {
                refs[stringRef] = value;
              }
            };
            ref._stringRef = stringRef;
            return ref;
          } else {
            !(typeof mixedRef === 'string') ? invariant(false, 'Expected ref to be a function or a string.') : void 0;
            !element._owner ? invariant(false, 'Element ref was specified as a string (%s) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).', mixedRef) : void 0;
          }
        }
        return mixedRef;
      }
      function throwOnInvalidObjectType(returnFiber, newChild) {
        if (returnFiber.type !== 'textarea') {
          var addendum = '';
          {
            addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + (getCurrentFiberStackAddendum$1() || '');
          }
          invariant(false, 'Objects are not valid as a React child (found: %s).%s', Object.prototype.toString.call(newChild) === '[object Object]' ? 'object with keys {' + Object.keys(newChild).join(', ') + '}' : newChild, addendum);
        }
      }
      function warnOnFunctionType() {
        var currentComponentErrorInfo = 'Functions are not valid as a React child. This may happen if ' + 'you return a Component instead of <Component /> from render. ' + 'Or maybe you meant to call this function rather than return it.' + (getCurrentFiberStackAddendum$1() || '');
        if (ownerHasFunctionTypeWarning[currentComponentErrorInfo]) {
          return;
        }
        ownerHasFunctionTypeWarning[currentComponentErrorInfo] = true;
        warning(false, 'Functions are not valid as a React child. This may happen if ' + 'you return a Component instead of <Component /> from render. ' + 'Or maybe you meant to call this function rather than return it.%s', getCurrentFiberStackAddendum$1() || '');
      }
      function ChildReconciler(shouldClone, shouldTrackSideEffects) {
        function deleteChild(returnFiber, childToDelete) {
          if (!shouldTrackSideEffects) {
            return;
          }
          if (!shouldClone) {
            if (childToDelete.alternate === null) {
              return;
            }
            childToDelete = childToDelete.alternate;
          }
          var last = returnFiber.lastEffect;
          if (last !== null) {
            last.nextEffect = childToDelete;
            returnFiber.lastEffect = childToDelete;
          } else {
            returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
          }
          childToDelete.nextEffect = null;
          childToDelete.effectTag = Deletion;
        }
        function deleteRemainingChildren(returnFiber, currentFirstChild) {
          if (!shouldTrackSideEffects) {
            return null;
          }
          var childToDelete = currentFirstChild;
          while (childToDelete !== null) {
            deleteChild(returnFiber, childToDelete);
            childToDelete = childToDelete.sibling;
          }
          return null;
        }
        function mapRemainingChildren(returnFiber, currentFirstChild) {
          var existingChildren = new Map();
          var existingChild = currentFirstChild;
          while (existingChild !== null) {
            if (existingChild.key !== null) {
              existingChildren.set(existingChild.key, existingChild);
            } else {
              existingChildren.set(existingChild.index, existingChild);
            }
            existingChild = existingChild.sibling;
          }
          return existingChildren;
        }
        function useFiber(fiber, pendingProps, expirationTime) {
          if (shouldClone) {
            var clone = createWorkInProgress(fiber, pendingProps, expirationTime);
            clone.index = 0;
            clone.sibling = null;
            return clone;
          } else {
            fiber.expirationTime = expirationTime;
            fiber.effectTag = NoEffect;
            fiber.index = 0;
            fiber.sibling = null;
            fiber.pendingProps = pendingProps;
            return fiber;
          }
        }
        function placeChild(newFiber, lastPlacedIndex, newIndex) {
          newFiber.index = newIndex;
          if (!shouldTrackSideEffects) {
            return lastPlacedIndex;
          }
          var current = newFiber.alternate;
          if (current !== null) {
            var oldIndex = current.index;
            if (oldIndex < lastPlacedIndex) {
              newFiber.effectTag = Placement;
              return lastPlacedIndex;
            } else {
              return oldIndex;
            }
          } else {
            newFiber.effectTag = Placement;
            return lastPlacedIndex;
          }
        }
        function placeSingleChild(newFiber) {
          if (shouldTrackSideEffects && newFiber.alternate === null) {
            newFiber.effectTag = Placement;
          }
          return newFiber;
        }
        function updateTextNode(returnFiber, current, textContent, expirationTime) {
          if (current === null || current.tag !== HostText) {
            var created = createFiberFromText(textContent, returnFiber.internalContextTag, expirationTime);
            created['return'] = returnFiber;
            return created;
          } else {
            var existing = useFiber(current, textContent, expirationTime);
            existing['return'] = returnFiber;
            return existing;
          }
        }
        function updateElement(returnFiber, current, element, expirationTime) {
          if (current !== null && current.type === element.type) {
            var existing = useFiber(current, element.props, expirationTime);
            existing.ref = coerceRef(current, element);
            existing['return'] = returnFiber;
            {
              existing._debugSource = element._source;
              existing._debugOwner = element._owner;
            }
            return existing;
          } else {
            var created = createFiberFromElement(element, returnFiber.internalContextTag, expirationTime);
            created.ref = coerceRef(current, element);
            created['return'] = returnFiber;
            return created;
          }
        }
        function updateCall(returnFiber, current, call, expirationTime) {
          if (current === null || current.tag !== CallComponent) {
            var created = createFiberFromCall(call, returnFiber.internalContextTag, expirationTime);
            created['return'] = returnFiber;
            return created;
          } else {
            var existing = useFiber(current, call, expirationTime);
            existing['return'] = returnFiber;
            return existing;
          }
        }
        function updateReturn(returnFiber, current, returnNode, expirationTime) {
          if (current === null || current.tag !== ReturnComponent) {
            var created = createFiberFromReturn(returnNode, returnFiber.internalContextTag, expirationTime);
            created.type = returnNode.value;
            created['return'] = returnFiber;
            return created;
          } else {
            var existing = useFiber(current, null, expirationTime);
            existing.type = returnNode.value;
            existing['return'] = returnFiber;
            return existing;
          }
        }
        function updatePortal(returnFiber, current, portal, expirationTime) {
          if (current === null || current.tag !== HostPortal || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation) {
            var created = createFiberFromPortal(portal, returnFiber.internalContextTag, expirationTime);
            created['return'] = returnFiber;
            return created;
          } else {
            var existing = useFiber(current, portal.children || [], expirationTime);
            existing['return'] = returnFiber;
            return existing;
          }
        }
        function updateFragment(returnFiber, current, fragment, expirationTime, key) {
          if (current === null || current.tag !== Fragment) {
            var created = createFiberFromFragment(fragment, returnFiber.internalContextTag, expirationTime, key);
            created['return'] = returnFiber;
            return created;
          } else {
            var existing = useFiber(current, fragment, expirationTime);
            existing['return'] = returnFiber;
            return existing;
          }
        }
        function createChild(returnFiber, newChild, expirationTime) {
          if (typeof newChild === 'string' || typeof newChild === 'number') {
            var created = createFiberFromText('' + newChild, returnFiber.internalContextTag, expirationTime);
            created['return'] = returnFiber;
            return created;
          }
          if (typeof newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
              case REACT_ELEMENT_TYPE:
                {
                  if (newChild.type === REACT_FRAGMENT_TYPE) {
                    var _created = createFiberFromFragment(newChild.props.children, returnFiber.internalContextTag, expirationTime, newChild.key);
                    _created['return'] = returnFiber;
                    return _created;
                  } else {
                    var _created2 = createFiberFromElement(newChild, returnFiber.internalContextTag, expirationTime);
                    _created2.ref = coerceRef(null, newChild);
                    _created2['return'] = returnFiber;
                    return _created2;
                  }
                }
              case REACT_CALL_TYPE:
                {
                  var _created3 = createFiberFromCall(newChild, returnFiber.internalContextTag, expirationTime);
                  _created3['return'] = returnFiber;
                  return _created3;
                }
              case REACT_RETURN_TYPE:
                {
                  var _created4 = createFiberFromReturn(newChild, returnFiber.internalContextTag, expirationTime);
                  _created4.type = newChild.value;
                  _created4['return'] = returnFiber;
                  return _created4;
                }
              case REACT_PORTAL_TYPE:
                {
                  var _created5 = createFiberFromPortal(newChild, returnFiber.internalContextTag, expirationTime);
                  _created5['return'] = returnFiber;
                  return _created5;
                }
            }
            if (isArray$1(newChild) || getIteratorFn(newChild)) {
              var _created6 = createFiberFromFragment(newChild, returnFiber.internalContextTag, expirationTime, null);
              _created6['return'] = returnFiber;
              return _created6;
            }
            throwOnInvalidObjectType(returnFiber, newChild);
          }
          {
            if (typeof newChild === 'function') {
              warnOnFunctionType();
            }
          }
          return null;
        }
        function updateSlot(returnFiber, oldFiber, newChild, expirationTime) {
          var key = oldFiber !== null ? oldFiber.key : null;
          if (typeof newChild === 'string' || typeof newChild === 'number') {
            if (key !== null) {
              return null;
            }
            return updateTextNode(returnFiber, oldFiber, '' + newChild, expirationTime);
          }
          if (typeof newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
              case REACT_ELEMENT_TYPE:
                {
                  if (newChild.key === key) {
                    if (newChild.type === REACT_FRAGMENT_TYPE) {
                      return updateFragment(returnFiber, oldFiber, newChild.props.children, expirationTime, key);
                    }
                    return updateElement(returnFiber, oldFiber, newChild, expirationTime);
                  } else {
                    return null;
                  }
                }
              case REACT_CALL_TYPE:
                {
                  if (newChild.key === key) {
                    return updateCall(returnFiber, oldFiber, newChild, expirationTime);
                  } else {
                    return null;
                  }
                }
              case REACT_RETURN_TYPE:
                {
                  if (key === null) {
                    return updateReturn(returnFiber, oldFiber, newChild, expirationTime);
                  } else {
                    return null;
                  }
                }
              case REACT_PORTAL_TYPE:
                {
                  if (newChild.key === key) {
                    return updatePortal(returnFiber, oldFiber, newChild, expirationTime);
                  } else {
                    return null;
                  }
                }
            }
            if (isArray$1(newChild) || getIteratorFn(newChild)) {
              if (key !== null) {
                return null;
              }
              return updateFragment(returnFiber, oldFiber, newChild, expirationTime, null);
            }
            throwOnInvalidObjectType(returnFiber, newChild);
          }
          {
            if (typeof newChild === 'function') {
              warnOnFunctionType();
            }
          }
          return null;
        }
        function updateFromMap(existingChildren, returnFiber, newIdx, newChild, expirationTime) {
          if (typeof newChild === 'string' || typeof newChild === 'number') {
            var matchedFiber = existingChildren.get(newIdx) || null;
            return updateTextNode(returnFiber, matchedFiber, '' + newChild, expirationTime);
          }
          if (typeof newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
              case REACT_ELEMENT_TYPE:
                {
                  var _matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
                  if (newChild.type === REACT_FRAGMENT_TYPE) {
                    return updateFragment(returnFiber, _matchedFiber, newChild.props.children, expirationTime, newChild.key);
                  }
                  return updateElement(returnFiber, _matchedFiber, newChild, expirationTime);
                }
              case REACT_CALL_TYPE:
                {
                  var _matchedFiber2 = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
                  return updateCall(returnFiber, _matchedFiber2, newChild, expirationTime);
                }
              case REACT_RETURN_TYPE:
                {
                  var _matchedFiber3 = existingChildren.get(newIdx) || null;
                  return updateReturn(returnFiber, _matchedFiber3, newChild, expirationTime);
                }
              case REACT_PORTAL_TYPE:
                {
                  var _matchedFiber4 = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
                  return updatePortal(returnFiber, _matchedFiber4, newChild, expirationTime);
                }
            }
            if (isArray$1(newChild) || getIteratorFn(newChild)) {
              var _matchedFiber5 = existingChildren.get(newIdx) || null;
              return updateFragment(returnFiber, _matchedFiber5, newChild, expirationTime, null);
            }
            throwOnInvalidObjectType(returnFiber, newChild);
          }
          {
            if (typeof newChild === 'function') {
              warnOnFunctionType();
            }
          }
          return null;
        }
        function warnOnInvalidKey(child, knownKeys) {
          {
            if (typeof child !== 'object' || child === null) {
              return knownKeys;
            }
            switch (child.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_CALL_TYPE:
              case REACT_PORTAL_TYPE:
                warnForMissingKey(child);
                var key = child.key;
                if (typeof key !== 'string') {
                  break;
                }
                if (knownKeys === null) {
                  knownKeys = new Set();
                  knownKeys.add(key);
                  break;
                }
                if (!knownKeys.has(key)) {
                  knownKeys.add(key);
                  break;
                }
                warning(false, 'Encountered two children with the same key, `%s`. ' + 'Keys should be unique so that components maintain their identity ' + 'across updates. Non-unique keys may cause children to be ' + 'duplicated and/or omitted — the behavior is unsupported and ' + 'could change in a future version.%s', key, getCurrentFiberStackAddendum$1());
                break;
              default:
                break;
            }
          }
          return knownKeys;
        }
        function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime) {
          {
            var knownKeys = null;
            for (var i = 0; i < newChildren.length; i++) {
              var child = newChildren[i];
              knownKeys = warnOnInvalidKey(child, knownKeys);
            }
          }
          var resultingFirstChild = null;
          var previousNewFiber = null;
          var oldFiber = currentFirstChild;
          var lastPlacedIndex = 0;
          var newIdx = 0;
          var nextOldFiber = null;
          for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
            if (oldFiber.index > newIdx) {
              nextOldFiber = oldFiber;
              oldFiber = null;
            } else {
              nextOldFiber = oldFiber.sibling;
            }
            var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], expirationTime);
            if (newFiber === null) {
              if (oldFiber === null) {
                oldFiber = nextOldFiber;
              }
              break;
            }
            if (shouldTrackSideEffects) {
              if (oldFiber && newFiber.alternate === null) {
                deleteChild(returnFiber, oldFiber);
              }
            }
            lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
            if (previousNewFiber === null) {
              resultingFirstChild = newFiber;
            } else {
              previousNewFiber.sibling = newFiber;
            }
            previousNewFiber = newFiber;
            oldFiber = nextOldFiber;
          }
          if (newIdx === newChildren.length) {
            deleteRemainingChildren(returnFiber, oldFiber);
            return resultingFirstChild;
          }
          if (oldFiber === null) {
            for (; newIdx < newChildren.length; newIdx++) {
              var _newFiber = createChild(returnFiber, newChildren[newIdx], expirationTime);
              if (!_newFiber) {
                continue;
              }
              lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);
              if (previousNewFiber === null) {
                resultingFirstChild = _newFiber;
              } else {
                previousNewFiber.sibling = _newFiber;
              }
              previousNewFiber = _newFiber;
            }
            return resultingFirstChild;
          }
          var existingChildren = mapRemainingChildren(returnFiber, oldFiber);
          for (; newIdx < newChildren.length; newIdx++) {
            var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], expirationTime);
            if (_newFiber2) {
              if (shouldTrackSideEffects) {
                if (_newFiber2.alternate !== null) {
                  existingChildren['delete'](_newFiber2.key === null ? newIdx : _newFiber2.key);
                }
              }
              lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);
              if (previousNewFiber === null) {
                resultingFirstChild = _newFiber2;
              } else {
                previousNewFiber.sibling = _newFiber2;
              }
              previousNewFiber = _newFiber2;
            }
          }
          if (shouldTrackSideEffects) {
            existingChildren.forEach(function(child) {
              return deleteChild(returnFiber, child);
            });
          }
          return resultingFirstChild;
        }
        function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildrenIterable, expirationTime) {
          var iteratorFn = getIteratorFn(newChildrenIterable);
          !(typeof iteratorFn === 'function') ? invariant(false, 'An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          {
            if (typeof newChildrenIterable.entries === 'function') {
              var possibleMap = newChildrenIterable;
              if (possibleMap.entries === iteratorFn) {
                warning(didWarnAboutMaps, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.%s', getCurrentFiberStackAddendum$1());
                didWarnAboutMaps = true;
              }
            }
            var _newChildren = iteratorFn.call(newChildrenIterable);
            if (_newChildren) {
              var knownKeys = null;
              var _step = _newChildren.next();
              for (; !_step.done; _step = _newChildren.next()) {
                var child = _step.value;
                knownKeys = warnOnInvalidKey(child, knownKeys);
              }
            }
          }
          var newChildren = iteratorFn.call(newChildrenIterable);
          !(newChildren != null) ? invariant(false, 'An iterable object provided no iterator.') : void 0;
          var resultingFirstChild = null;
          var previousNewFiber = null;
          var oldFiber = currentFirstChild;
          var lastPlacedIndex = 0;
          var newIdx = 0;
          var nextOldFiber = null;
          var step = newChildren.next();
          for (; oldFiber !== null && !step.done; newIdx++, step = newChildren.next()) {
            if (oldFiber.index > newIdx) {
              nextOldFiber = oldFiber;
              oldFiber = null;
            } else {
              nextOldFiber = oldFiber.sibling;
            }
            var newFiber = updateSlot(returnFiber, oldFiber, step.value, expirationTime);
            if (newFiber === null) {
              if (!oldFiber) {
                oldFiber = nextOldFiber;
              }
              break;
            }
            if (shouldTrackSideEffects) {
              if (oldFiber && newFiber.alternate === null) {
                deleteChild(returnFiber, oldFiber);
              }
            }
            lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
            if (previousNewFiber === null) {
              resultingFirstChild = newFiber;
            } else {
              previousNewFiber.sibling = newFiber;
            }
            previousNewFiber = newFiber;
            oldFiber = nextOldFiber;
          }
          if (step.done) {
            deleteRemainingChildren(returnFiber, oldFiber);
            return resultingFirstChild;
          }
          if (oldFiber === null) {
            for (; !step.done; newIdx++, step = newChildren.next()) {
              var _newFiber3 = createChild(returnFiber, step.value, expirationTime);
              if (_newFiber3 === null) {
                continue;
              }
              lastPlacedIndex = placeChild(_newFiber3, lastPlacedIndex, newIdx);
              if (previousNewFiber === null) {
                resultingFirstChild = _newFiber3;
              } else {
                previousNewFiber.sibling = _newFiber3;
              }
              previousNewFiber = _newFiber3;
            }
            return resultingFirstChild;
          }
          var existingChildren = mapRemainingChildren(returnFiber, oldFiber);
          for (; !step.done; newIdx++, step = newChildren.next()) {
            var _newFiber4 = updateFromMap(existingChildren, returnFiber, newIdx, step.value, expirationTime);
            if (_newFiber4 !== null) {
              if (shouldTrackSideEffects) {
                if (_newFiber4.alternate !== null) {
                  existingChildren['delete'](_newFiber4.key === null ? newIdx : _newFiber4.key);
                }
              }
              lastPlacedIndex = placeChild(_newFiber4, lastPlacedIndex, newIdx);
              if (previousNewFiber === null) {
                resultingFirstChild = _newFiber4;
              } else {
                previousNewFiber.sibling = _newFiber4;
              }
              previousNewFiber = _newFiber4;
            }
          }
          if (shouldTrackSideEffects) {
            existingChildren.forEach(function(child) {
              return deleteChild(returnFiber, child);
            });
          }
          return resultingFirstChild;
        }
        function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent, expirationTime) {
          if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
            deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
            var existing = useFiber(currentFirstChild, textContent, expirationTime);
            existing['return'] = returnFiber;
            return existing;
          }
          deleteRemainingChildren(returnFiber, currentFirstChild);
          var created = createFiberFromText(textContent, returnFiber.internalContextTag, expirationTime);
          created['return'] = returnFiber;
          return created;
        }
        function reconcileSingleElement(returnFiber, currentFirstChild, element, expirationTime) {
          var key = element.key;
          var child = currentFirstChild;
          while (child !== null) {
            if (child.key === key) {
              if (child.tag === Fragment ? element.type === REACT_FRAGMENT_TYPE : child.type === element.type) {
                deleteRemainingChildren(returnFiber, child.sibling);
                var existing = useFiber(child, element.type === REACT_FRAGMENT_TYPE ? element.props.children : element.props, expirationTime);
                existing.ref = coerceRef(child, element);
                existing['return'] = returnFiber;
                {
                  existing._debugSource = element._source;
                  existing._debugOwner = element._owner;
                }
                return existing;
              } else {
                deleteRemainingChildren(returnFiber, child);
                break;
              }
            } else {
              deleteChild(returnFiber, child);
            }
            child = child.sibling;
          }
          if (element.type === REACT_FRAGMENT_TYPE) {
            var created = createFiberFromFragment(element.props.children, returnFiber.internalContextTag, expirationTime, element.key);
            created['return'] = returnFiber;
            return created;
          } else {
            var _created7 = createFiberFromElement(element, returnFiber.internalContextTag, expirationTime);
            _created7.ref = coerceRef(currentFirstChild, element);
            _created7['return'] = returnFiber;
            return _created7;
          }
        }
        function reconcileSingleCall(returnFiber, currentFirstChild, call, expirationTime) {
          var key = call.key;
          var child = currentFirstChild;
          while (child !== null) {
            if (child.key === key) {
              if (child.tag === CallComponent) {
                deleteRemainingChildren(returnFiber, child.sibling);
                var existing = useFiber(child, call, expirationTime);
                existing['return'] = returnFiber;
                return existing;
              } else {
                deleteRemainingChildren(returnFiber, child);
                break;
              }
            } else {
              deleteChild(returnFiber, child);
            }
            child = child.sibling;
          }
          var created = createFiberFromCall(call, returnFiber.internalContextTag, expirationTime);
          created['return'] = returnFiber;
          return created;
        }
        function reconcileSingleReturn(returnFiber, currentFirstChild, returnNode, expirationTime) {
          var child = currentFirstChild;
          if (child !== null) {
            if (child.tag === ReturnComponent) {
              deleteRemainingChildren(returnFiber, child.sibling);
              var existing = useFiber(child, null, expirationTime);
              existing.type = returnNode.value;
              existing['return'] = returnFiber;
              return existing;
            } else {
              deleteRemainingChildren(returnFiber, child);
            }
          }
          var created = createFiberFromReturn(returnNode, returnFiber.internalContextTag, expirationTime);
          created.type = returnNode.value;
          created['return'] = returnFiber;
          return created;
        }
        function reconcileSinglePortal(returnFiber, currentFirstChild, portal, expirationTime) {
          var key = portal.key;
          var child = currentFirstChild;
          while (child !== null) {
            if (child.key === key) {
              if (child.tag === HostPortal && child.stateNode.containerInfo === portal.containerInfo && child.stateNode.implementation === portal.implementation) {
                deleteRemainingChildren(returnFiber, child.sibling);
                var existing = useFiber(child, portal.children || [], expirationTime);
                existing['return'] = returnFiber;
                return existing;
              } else {
                deleteRemainingChildren(returnFiber, child);
                break;
              }
            } else {
              deleteChild(returnFiber, child);
            }
            child = child.sibling;
          }
          var created = createFiberFromPortal(portal, returnFiber.internalContextTag, expirationTime);
          created['return'] = returnFiber;
          return created;
        }
        function reconcileChildFibers(returnFiber, currentFirstChild, newChild, expirationTime) {
          if (enableReactFragment && typeof newChild === 'object' && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null) {
            newChild = newChild.props.children;
          }
          var isObject = typeof newChild === 'object' && newChild !== null;
          if (isObject) {
            switch (newChild.$$typeof) {
              case REACT_ELEMENT_TYPE:
                return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, expirationTime));
              case REACT_CALL_TYPE:
                return placeSingleChild(reconcileSingleCall(returnFiber, currentFirstChild, newChild, expirationTime));
              case REACT_RETURN_TYPE:
                return placeSingleChild(reconcileSingleReturn(returnFiber, currentFirstChild, newChild, expirationTime));
              case REACT_PORTAL_TYPE:
                return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, expirationTime));
            }
          }
          if (typeof newChild === 'string' || typeof newChild === 'number') {
            return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, expirationTime));
          }
          if (isArray$1(newChild)) {
            return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, expirationTime);
          }
          if (getIteratorFn(newChild)) {
            return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, expirationTime);
          }
          if (isObject) {
            throwOnInvalidObjectType(returnFiber, newChild);
          }
          {
            if (typeof newChild === 'function') {
              warnOnFunctionType();
            }
          }
          if (typeof newChild === 'undefined') {
            switch (returnFiber.tag) {
              case ClassComponent:
                {
                  {
                    var instance = returnFiber.stateNode;
                    if (instance.render._isMockFunction) {
                      break;
                    }
                  }
                }
              case FunctionalComponent:
                {
                  var Component = returnFiber.type;
                  invariant(false, '%s(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.', Component.displayName || Component.name || 'Component');
                }
            }
          }
          return deleteRemainingChildren(returnFiber, currentFirstChild);
        }
        return reconcileChildFibers;
      }
      var reconcileChildFibers = ChildReconciler(true, true);
      var reconcileChildFibersInPlace = ChildReconciler(false, true);
      var mountChildFibersInPlace = ChildReconciler(false, false);
      function cloneChildFibers(current, workInProgress) {
        !(current === null || workInProgress.child === current.child) ? invariant(false, 'Resuming work not yet implemented.') : void 0;
        if (workInProgress.child === null) {
          return;
        }
        var currentChild = workInProgress.child;
        var newChild = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
        workInProgress.child = newChild;
        newChild['return'] = workInProgress;
        while (currentChild.sibling !== null) {
          currentChild = currentChild.sibling;
          newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
          newChild['return'] = workInProgress;
        }
        newChild.sibling = null;
      }
      {
        var warnedAboutStatelessRefs = {};
      }
      var ReactFiberBeginWork = function(config, hostContext, hydrationContext, scheduleWork, computeExpirationForFiber) {
        var shouldSetTextContent = config.shouldSetTextContent,
            useSyncScheduling = config.useSyncScheduling,
            shouldDeprioritizeSubtree = config.shouldDeprioritizeSubtree;
        var pushHostContext = hostContext.pushHostContext,
            pushHostContainer = hostContext.pushHostContainer;
        var enterHydrationState = hydrationContext.enterHydrationState,
            resetHydrationState = hydrationContext.resetHydrationState,
            tryToClaimNextHydratableInstance = hydrationContext.tryToClaimNextHydratableInstance;
        var _ReactFiberClassCompo = ReactFiberClassComponent(scheduleWork, computeExpirationForFiber, memoizeProps, memoizeState),
            adoptClassInstance = _ReactFiberClassCompo.adoptClassInstance,
            constructClassInstance = _ReactFiberClassCompo.constructClassInstance,
            mountClassInstance = _ReactFiberClassCompo.mountClassInstance,
            updateClassInstance = _ReactFiberClassCompo.updateClassInstance;
        function reconcileChildren(current, workInProgress, nextChildren) {
          reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, workInProgress.expirationTime);
        }
        function reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, renderExpirationTime) {
          if (current === null) {
            workInProgress.child = mountChildFibersInPlace(workInProgress, workInProgress.child, nextChildren, renderExpirationTime);
          } else if (current.child === workInProgress.child) {
            workInProgress.child = reconcileChildFibers(workInProgress, workInProgress.child, nextChildren, renderExpirationTime);
          } else {
            workInProgress.child = reconcileChildFibersInPlace(workInProgress, workInProgress.child, nextChildren, renderExpirationTime);
          }
        }
        function updateFragment(current, workInProgress) {
          var nextChildren = workInProgress.pendingProps;
          if (hasContextChanged()) {
            if (nextChildren === null) {
              nextChildren = workInProgress.memoizedProps;
            }
          } else if (nextChildren === null || workInProgress.memoizedProps === nextChildren) {
            return bailoutOnAlreadyFinishedWork(current, workInProgress);
          }
          reconcileChildren(current, workInProgress, nextChildren);
          memoizeProps(workInProgress, nextChildren);
          return workInProgress.child;
        }
        function markRef(current, workInProgress) {
          var ref = workInProgress.ref;
          if (ref !== null && (!current || current.ref !== ref)) {
            workInProgress.effectTag |= Ref;
          }
        }
        function updateFunctionalComponent(current, workInProgress) {
          var fn = workInProgress.type;
          var nextProps = workInProgress.pendingProps;
          var memoizedProps = workInProgress.memoizedProps;
          if (hasContextChanged()) {
            if (nextProps === null) {
              nextProps = memoizedProps;
            }
          } else {
            if (nextProps === null || memoizedProps === nextProps) {
              return bailoutOnAlreadyFinishedWork(current, workInProgress);
            }
          }
          var unmaskedContext = getUnmaskedContext(workInProgress);
          var context = getMaskedContext(workInProgress, unmaskedContext);
          var nextChildren;
          {
            ReactCurrentOwner.current = workInProgress;
            ReactDebugCurrentFiber.setCurrentPhase('render');
            nextChildren = fn(nextProps, context);
            ReactDebugCurrentFiber.setCurrentPhase(null);
          }
          workInProgress.effectTag |= PerformedWork;
          reconcileChildren(current, workInProgress, nextChildren);
          memoizeProps(workInProgress, nextProps);
          return workInProgress.child;
        }
        function updateClassComponent(current, workInProgress, renderExpirationTime) {
          var hasContext = pushContextProvider(workInProgress);
          var shouldUpdate = void 0;
          if (current === null) {
            if (!workInProgress.stateNode) {
              constructClassInstance(workInProgress, workInProgress.pendingProps);
              mountClassInstance(workInProgress, renderExpirationTime);
              shouldUpdate = true;
            } else {
              invariant(false, 'Resuming work not yet implemented.');
            }
          } else {
            shouldUpdate = updateClassInstance(current, workInProgress, renderExpirationTime);
          }
          return finishClassComponent(current, workInProgress, shouldUpdate, hasContext);
        }
        function finishClassComponent(current, workInProgress, shouldUpdate, hasContext) {
          markRef(current, workInProgress);
          if (!shouldUpdate) {
            if (hasContext) {
              invalidateContextProvider(workInProgress, false);
            }
            return bailoutOnAlreadyFinishedWork(current, workInProgress);
          }
          var instance = workInProgress.stateNode;
          ReactCurrentOwner.current = workInProgress;
          var nextChildren = void 0;
          {
            ReactDebugCurrentFiber.setCurrentPhase('render');
            nextChildren = instance.render();
            ReactDebugCurrentFiber.setCurrentPhase(null);
          }
          workInProgress.effectTag |= PerformedWork;
          reconcileChildren(current, workInProgress, nextChildren);
          memoizeState(workInProgress, instance.state);
          memoizeProps(workInProgress, instance.props);
          if (hasContext) {
            invalidateContextProvider(workInProgress, true);
          }
          return workInProgress.child;
        }
        function pushHostRootContext(workInProgress) {
          var root = workInProgress.stateNode;
          if (root.pendingContext) {
            pushTopLevelContextObject(workInProgress, root.pendingContext, root.pendingContext !== root.context);
          } else if (root.context) {
            pushTopLevelContextObject(workInProgress, root.context, false);
          }
          pushHostContainer(workInProgress, root.containerInfo);
        }
        function updateHostRoot(current, workInProgress, renderExpirationTime) {
          pushHostRootContext(workInProgress);
          var updateQueue = workInProgress.updateQueue;
          if (updateQueue !== null) {
            var prevState = workInProgress.memoizedState;
            var state = processUpdateQueue(current, workInProgress, updateQueue, null, null, renderExpirationTime);
            if (prevState === state) {
              resetHydrationState();
              return bailoutOnAlreadyFinishedWork(current, workInProgress);
            }
            var element = state.element;
            var root = workInProgress.stateNode;
            if ((current === null || current.child === null) && root.hydrate && enterHydrationState(workInProgress)) {
              workInProgress.effectTag |= Placement;
              workInProgress.child = mountChildFibersInPlace(workInProgress, workInProgress.child, element, renderExpirationTime);
            } else {
              resetHydrationState();
              reconcileChildren(current, workInProgress, element);
            }
            memoizeState(workInProgress, state);
            return workInProgress.child;
          }
          resetHydrationState();
          return bailoutOnAlreadyFinishedWork(current, workInProgress);
        }
        function updateHostComponent(current, workInProgress, renderExpirationTime) {
          pushHostContext(workInProgress);
          if (current === null) {
            tryToClaimNextHydratableInstance(workInProgress);
          }
          var type = workInProgress.type;
          var memoizedProps = workInProgress.memoizedProps;
          var nextProps = workInProgress.pendingProps;
          if (nextProps === null) {
            nextProps = memoizedProps;
            !(nextProps !== null) ? invariant(false, 'We should always have pending or current props. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          }
          var prevProps = current !== null ? current.memoizedProps : null;
          if (hasContextChanged()) {} else if (nextProps === null || memoizedProps === nextProps) {
            return bailoutOnAlreadyFinishedWork(current, workInProgress);
          }
          var nextChildren = nextProps.children;
          var isDirectTextChild = shouldSetTextContent(type, nextProps);
          if (isDirectTextChild) {
            nextChildren = null;
          } else if (prevProps && shouldSetTextContent(type, prevProps)) {
            workInProgress.effectTag |= ContentReset;
          }
          markRef(current, workInProgress);
          if (renderExpirationTime !== Never && !useSyncScheduling && shouldDeprioritizeSubtree(type, nextProps)) {
            workInProgress.expirationTime = Never;
            return null;
          }
          reconcileChildren(current, workInProgress, nextChildren);
          memoizeProps(workInProgress, nextProps);
          return workInProgress.child;
        }
        function updateHostText(current, workInProgress) {
          if (current === null) {
            tryToClaimNextHydratableInstance(workInProgress);
          }
          var nextProps = workInProgress.pendingProps;
          if (nextProps === null) {
            nextProps = workInProgress.memoizedProps;
          }
          memoizeProps(workInProgress, nextProps);
          return null;
        }
        function mountIndeterminateComponent(current, workInProgress, renderExpirationTime) {
          !(current === null) ? invariant(false, 'An indeterminate component should never have mounted. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          var fn = workInProgress.type;
          var props = workInProgress.pendingProps;
          var unmaskedContext = getUnmaskedContext(workInProgress);
          var context = getMaskedContext(workInProgress, unmaskedContext);
          var value;
          {
            if (fn.prototype && typeof fn.prototype.render === 'function') {
              var componentName = getComponentName(workInProgress);
              warning(false, "The <%s /> component appears to have a render method, but doesn't extend React.Component. " + 'This is likely to cause errors. Change %s to extend React.Component instead.', componentName, componentName);
            }
            ReactCurrentOwner.current = workInProgress;
            value = fn(props, context);
          }
          workInProgress.effectTag |= PerformedWork;
          if (typeof value === 'object' && value !== null && typeof value.render === 'function') {
            workInProgress.tag = ClassComponent;
            var hasContext = pushContextProvider(workInProgress);
            adoptClassInstance(workInProgress, value);
            mountClassInstance(workInProgress, renderExpirationTime);
            return finishClassComponent(current, workInProgress, true, hasContext);
          } else {
            workInProgress.tag = FunctionalComponent;
            {
              var Component = workInProgress.type;
              if (Component) {
                warning(!Component.childContextTypes, '%s(...): childContextTypes cannot be defined on a functional component.', Component.displayName || Component.name || 'Component');
              }
              if (workInProgress.ref !== null) {
                var info = '';
                var ownerName = ReactDebugCurrentFiber.getCurrentFiberOwnerName();
                if (ownerName) {
                  info += '\n\nCheck the render method of `' + ownerName + '`.';
                }
                var warningKey = ownerName || workInProgress._debugID || '';
                var debugSource = workInProgress._debugSource;
                if (debugSource) {
                  warningKey = debugSource.fileName + ':' + debugSource.lineNumber;
                }
                if (!warnedAboutStatelessRefs[warningKey]) {
                  warnedAboutStatelessRefs[warningKey] = true;
                  warning(false, 'Stateless function components cannot be given refs. ' + 'Attempts to access this ref will fail.%s%s', info, ReactDebugCurrentFiber.getCurrentFiberStackAddendum());
                }
              }
            }
            reconcileChildren(current, workInProgress, value);
            memoizeProps(workInProgress, props);
            return workInProgress.child;
          }
        }
        function updateCallComponent(current, workInProgress, renderExpirationTime) {
          var nextCall = workInProgress.pendingProps;
          if (hasContextChanged()) {
            if (nextCall === null) {
              nextCall = current && current.memoizedProps;
              !(nextCall !== null) ? invariant(false, 'We should always have pending or current props. This error is likely caused by a bug in React. Please file an issue.') : void 0;
            }
          } else if (nextCall === null || workInProgress.memoizedProps === nextCall) {
            nextCall = workInProgress.memoizedProps;
          }
          var nextChildren = nextCall.children;
          if (current === null) {
            workInProgress.stateNode = mountChildFibersInPlace(workInProgress, workInProgress.stateNode, nextChildren, renderExpirationTime);
          } else if (current.child === workInProgress.child) {
            workInProgress.stateNode = reconcileChildFibers(workInProgress, workInProgress.stateNode, nextChildren, renderExpirationTime);
          } else {
            workInProgress.stateNode = reconcileChildFibersInPlace(workInProgress, workInProgress.stateNode, nextChildren, renderExpirationTime);
          }
          memoizeProps(workInProgress, nextCall);
          return workInProgress.stateNode;
        }
        function updatePortalComponent(current, workInProgress, renderExpirationTime) {
          pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
          var nextChildren = workInProgress.pendingProps;
          if (hasContextChanged()) {
            if (nextChildren === null) {
              nextChildren = current && current.memoizedProps;
              !(nextChildren != null) ? invariant(false, 'We should always have pending or current props. This error is likely caused by a bug in React. Please file an issue.') : void 0;
            }
          } else if (nextChildren === null || workInProgress.memoizedProps === nextChildren) {
            return bailoutOnAlreadyFinishedWork(current, workInProgress);
          }
          if (current === null) {
            workInProgress.child = reconcileChildFibersInPlace(workInProgress, workInProgress.child, nextChildren, renderExpirationTime);
            memoizeProps(workInProgress, nextChildren);
          } else {
            reconcileChildren(current, workInProgress, nextChildren);
            memoizeProps(workInProgress, nextChildren);
          }
          return workInProgress.child;
        }
        function bailoutOnAlreadyFinishedWork(current, workInProgress) {
          cancelWorkTimer(workInProgress);
          cloneChildFibers(current, workInProgress);
          return workInProgress.child;
        }
        function bailoutOnLowPriority(current, workInProgress) {
          cancelWorkTimer(workInProgress);
          switch (workInProgress.tag) {
            case HostRoot:
              pushHostRootContext(workInProgress);
              break;
            case ClassComponent:
              pushContextProvider(workInProgress);
              break;
            case HostPortal:
              pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
              break;
          }
          return null;
        }
        function memoizeProps(workInProgress, nextProps) {
          workInProgress.memoizedProps = nextProps;
        }
        function memoizeState(workInProgress, nextState) {
          workInProgress.memoizedState = nextState;
        }
        function beginWork(current, workInProgress, renderExpirationTime) {
          if (workInProgress.expirationTime === NoWork || workInProgress.expirationTime > renderExpirationTime) {
            return bailoutOnLowPriority(current, workInProgress);
          }
          switch (workInProgress.tag) {
            case IndeterminateComponent:
              return mountIndeterminateComponent(current, workInProgress, renderExpirationTime);
            case FunctionalComponent:
              return updateFunctionalComponent(current, workInProgress);
            case ClassComponent:
              return updateClassComponent(current, workInProgress, renderExpirationTime);
            case HostRoot:
              return updateHostRoot(current, workInProgress, renderExpirationTime);
            case HostComponent:
              return updateHostComponent(current, workInProgress, renderExpirationTime);
            case HostText:
              return updateHostText(current, workInProgress);
            case CallHandlerPhase:
              workInProgress.tag = CallComponent;
            case CallComponent:
              return updateCallComponent(current, workInProgress, renderExpirationTime);
            case ReturnComponent:
              return null;
            case HostPortal:
              return updatePortalComponent(current, workInProgress, renderExpirationTime);
            case Fragment:
              return updateFragment(current, workInProgress);
            default:
              invariant(false, 'Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue.');
          }
        }
        function beginFailedWork(current, workInProgress, renderExpirationTime) {
          switch (workInProgress.tag) {
            case ClassComponent:
              pushContextProvider(workInProgress);
              break;
            case HostRoot:
              pushHostRootContext(workInProgress);
              break;
            default:
              invariant(false, 'Invalid type of work. This error is likely caused by a bug in React. Please file an issue.');
          }
          workInProgress.effectTag |= Err;
          if (current === null) {
            workInProgress.child = null;
          } else if (workInProgress.child !== current.child) {
            workInProgress.child = current.child;
          }
          if (workInProgress.expirationTime === NoWork || workInProgress.expirationTime > renderExpirationTime) {
            return bailoutOnLowPriority(current, workInProgress);
          }
          workInProgress.firstEffect = null;
          workInProgress.lastEffect = null;
          var nextChildren = null;
          reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, renderExpirationTime);
          if (workInProgress.tag === ClassComponent) {
            var instance = workInProgress.stateNode;
            workInProgress.memoizedProps = instance.props;
            workInProgress.memoizedState = instance.state;
          }
          return workInProgress.child;
        }
        return {
          beginWork: beginWork,
          beginFailedWork: beginFailedWork
        };
      };
      var ReactFiberCompleteWork = function(config, hostContext, hydrationContext) {
        var createInstance = config.createInstance,
            createTextInstance = config.createTextInstance,
            appendInitialChild = config.appendInitialChild,
            finalizeInitialChildren = config.finalizeInitialChildren,
            prepareUpdate = config.prepareUpdate,
            mutation = config.mutation,
            persistence = config.persistence;
        var getRootHostContainer = hostContext.getRootHostContainer,
            popHostContext = hostContext.popHostContext,
            getHostContext = hostContext.getHostContext,
            popHostContainer = hostContext.popHostContainer;
        var prepareToHydrateHostInstance = hydrationContext.prepareToHydrateHostInstance,
            prepareToHydrateHostTextInstance = hydrationContext.prepareToHydrateHostTextInstance,
            popHydrationState = hydrationContext.popHydrationState;
        function markUpdate(workInProgress) {
          workInProgress.effectTag |= Update;
        }
        function markRef(workInProgress) {
          workInProgress.effectTag |= Ref;
        }
        function appendAllReturns(returns, workInProgress) {
          var node = workInProgress.stateNode;
          if (node) {
            node['return'] = workInProgress;
          }
          while (node !== null) {
            if (node.tag === HostComponent || node.tag === HostText || node.tag === HostPortal) {
              invariant(false, 'A call cannot have host component children.');
            } else if (node.tag === ReturnComponent) {
              returns.push(node.type);
            } else if (node.child !== null) {
              node.child['return'] = node;
              node = node.child;
              continue;
            }
            while (node.sibling === null) {
              if (node['return'] === null || node['return'] === workInProgress) {
                return;
              }
              node = node['return'];
            }
            node.sibling['return'] = node['return'];
            node = node.sibling;
          }
        }
        function moveCallToHandlerPhase(current, workInProgress, renderExpirationTime) {
          var call = workInProgress.memoizedProps;
          !call ? invariant(false, 'Should be resolved by now. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          workInProgress.tag = CallHandlerPhase;
          var returns = [];
          appendAllReturns(returns, workInProgress);
          var fn = call.handler;
          var props = call.props;
          var nextChildren = fn(props, returns);
          var currentFirstChild = current !== null ? current.child : null;
          workInProgress.child = reconcileChildFibers(workInProgress, currentFirstChild, nextChildren, renderExpirationTime);
          return workInProgress.child;
        }
        function appendAllChildren(parent, workInProgress) {
          var node = workInProgress.child;
          while (node !== null) {
            if (node.tag === HostComponent || node.tag === HostText) {
              appendInitialChild(parent, node.stateNode);
            } else if (node.tag === HostPortal) {} else if (node.child !== null) {
              node.child['return'] = node;
              node = node.child;
              continue;
            }
            if (node === workInProgress) {
              return;
            }
            while (node.sibling === null) {
              if (node['return'] === null || node['return'] === workInProgress) {
                return;
              }
              node = node['return'];
            }
            node.sibling['return'] = node['return'];
            node = node.sibling;
          }
        }
        var updateHostContainer = void 0;
        var updateHostComponent = void 0;
        var updateHostText = void 0;
        if (mutation) {
          if (enableMutatingReconciler) {
            updateHostContainer = function(workInProgress) {};
            updateHostComponent = function(current, workInProgress, updatePayload, type, oldProps, newProps, rootContainerInstance) {
              workInProgress.updateQueue = updatePayload;
              if (updatePayload) {
                markUpdate(workInProgress);
              }
            };
            updateHostText = function(current, workInProgress, oldText, newText) {
              if (oldText !== newText) {
                markUpdate(workInProgress);
              }
            };
          } else {
            invariant(false, 'Mutating reconciler is disabled.');
          }
        } else if (persistence) {
          if (enablePersistentReconciler) {
            var cloneInstance = persistence.cloneInstance,
                createContainerChildSet = persistence.createContainerChildSet,
                appendChildToContainerChildSet = persistence.appendChildToContainerChildSet,
                finalizeContainerChildren = persistence.finalizeContainerChildren;
            var appendAllChildrenToContainer = function(containerChildSet, workInProgress) {
              var node = workInProgress.child;
              while (node !== null) {
                if (node.tag === HostComponent || node.tag === HostText) {
                  appendChildToContainerChildSet(containerChildSet, node.stateNode);
                } else if (node.tag === HostPortal) {} else if (node.child !== null) {
                  node.child['return'] = node;
                  node = node.child;
                  continue;
                }
                if (node === workInProgress) {
                  return;
                }
                while (node.sibling === null) {
                  if (node['return'] === null || node['return'] === workInProgress) {
                    return;
                  }
                  node = node['return'];
                }
                node.sibling['return'] = node['return'];
                node = node.sibling;
              }
            };
            updateHostContainer = function(workInProgress) {
              var portalOrRoot = workInProgress.stateNode;
              var childrenUnchanged = workInProgress.firstEffect === null;
              if (childrenUnchanged) {} else {
                var container = portalOrRoot.containerInfo;
                var newChildSet = createContainerChildSet(container);
                if (finalizeContainerChildren(container, newChildSet)) {
                  markUpdate(workInProgress);
                }
                portalOrRoot.pendingChildren = newChildSet;
                appendAllChildrenToContainer(newChildSet, workInProgress);
                markUpdate(workInProgress);
              }
            };
            updateHostComponent = function(current, workInProgress, updatePayload, type, oldProps, newProps, rootContainerInstance) {
              var childrenUnchanged = workInProgress.firstEffect === null;
              var currentInstance = current.stateNode;
              if (childrenUnchanged && updatePayload === null) {
                workInProgress.stateNode = currentInstance;
              } else {
                var recyclableInstance = workInProgress.stateNode;
                var newInstance = cloneInstance(currentInstance, updatePayload, type, oldProps, newProps, workInProgress, childrenUnchanged, recyclableInstance);
                if (finalizeInitialChildren(newInstance, type, newProps, rootContainerInstance)) {
                  markUpdate(workInProgress);
                }
                workInProgress.stateNode = newInstance;
                if (childrenUnchanged) {
                  markUpdate(workInProgress);
                } else {
                  appendAllChildren(newInstance, workInProgress);
                }
              }
            };
            updateHostText = function(current, workInProgress, oldText, newText) {
              if (oldText !== newText) {
                var rootContainerInstance = getRootHostContainer();
                var currentHostContext = getHostContext();
                workInProgress.stateNode = createTextInstance(newText, rootContainerInstance, currentHostContext, workInProgress);
                markUpdate(workInProgress);
              }
            };
          } else {
            invariant(false, 'Persistent reconciler is disabled.');
          }
        } else {
          if (enableNoopReconciler) {
            updateHostContainer = function(workInProgress) {};
            updateHostComponent = function(current, workInProgress, updatePayload, type, oldProps, newProps, rootContainerInstance) {};
            updateHostText = function(current, workInProgress, oldText, newText) {};
          } else {
            invariant(false, 'Noop reconciler is disabled.');
          }
        }
        function completeWork(current, workInProgress, renderExpirationTime) {
          var newProps = workInProgress.pendingProps;
          if (newProps === null) {
            newProps = workInProgress.memoizedProps;
          } else if (workInProgress.expirationTime !== Never || renderExpirationTime === Never) {
            workInProgress.pendingProps = null;
          }
          switch (workInProgress.tag) {
            case FunctionalComponent:
              return null;
            case ClassComponent:
              {
                popContextProvider(workInProgress);
                return null;
              }
            case HostRoot:
              {
                popHostContainer(workInProgress);
                popTopLevelContextObject(workInProgress);
                var fiberRoot = workInProgress.stateNode;
                if (fiberRoot.pendingContext) {
                  fiberRoot.context = fiberRoot.pendingContext;
                  fiberRoot.pendingContext = null;
                }
                if (current === null || current.child === null) {
                  popHydrationState(workInProgress);
                  workInProgress.effectTag &= ~Placement;
                }
                updateHostContainer(workInProgress);
                return null;
              }
            case HostComponent:
              {
                popHostContext(workInProgress);
                var rootContainerInstance = getRootHostContainer();
                var type = workInProgress.type;
                if (current !== null && workInProgress.stateNode != null) {
                  var oldProps = current.memoizedProps;
                  var instance = workInProgress.stateNode;
                  var currentHostContext = getHostContext();
                  var updatePayload = prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, currentHostContext);
                  updateHostComponent(current, workInProgress, updatePayload, type, oldProps, newProps, rootContainerInstance);
                  if (current.ref !== workInProgress.ref) {
                    markRef(workInProgress);
                  }
                } else {
                  if (!newProps) {
                    !(workInProgress.stateNode !== null) ? invariant(false, 'We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.') : void 0;
                    return null;
                  }
                  var _currentHostContext = getHostContext();
                  var wasHydrated = popHydrationState(workInProgress);
                  if (wasHydrated) {
                    if (prepareToHydrateHostInstance(workInProgress, rootContainerInstance, _currentHostContext)) {
                      markUpdate(workInProgress);
                    }
                  } else {
                    var _instance = createInstance(type, newProps, rootContainerInstance, _currentHostContext, workInProgress);
                    appendAllChildren(_instance, workInProgress);
                    if (finalizeInitialChildren(_instance, type, newProps, rootContainerInstance)) {
                      markUpdate(workInProgress);
                    }
                    workInProgress.stateNode = _instance;
                  }
                  if (workInProgress.ref !== null) {
                    markRef(workInProgress);
                  }
                }
                return null;
              }
            case HostText:
              {
                var newText = newProps;
                if (current && workInProgress.stateNode != null) {
                  var oldText = current.memoizedProps;
                  updateHostText(current, workInProgress, oldText, newText);
                } else {
                  if (typeof newText !== 'string') {
                    !(workInProgress.stateNode !== null) ? invariant(false, 'We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.') : void 0;
                    return null;
                  }
                  var _rootContainerInstance = getRootHostContainer();
                  var _currentHostContext2 = getHostContext();
                  var _wasHydrated = popHydrationState(workInProgress);
                  if (_wasHydrated) {
                    if (prepareToHydrateHostTextInstance(workInProgress)) {
                      markUpdate(workInProgress);
                    }
                  } else {
                    workInProgress.stateNode = createTextInstance(newText, _rootContainerInstance, _currentHostContext2, workInProgress);
                  }
                }
                return null;
              }
            case CallComponent:
              return moveCallToHandlerPhase(current, workInProgress, renderExpirationTime);
            case CallHandlerPhase:
              workInProgress.tag = CallComponent;
              return null;
            case ReturnComponent:
              return null;
            case Fragment:
              return null;
            case HostPortal:
              popHostContainer(workInProgress);
              updateHostContainer(workInProgress);
              return null;
            case IndeterminateComponent:
              invariant(false, 'An indeterminate component should have become determinate before completing. This error is likely caused by a bug in React. Please file an issue.');
            default:
              invariant(false, 'Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue.');
          }
        }
        return {completeWork: completeWork};
      };
      var invokeGuardedCallback$2 = ReactErrorUtils.invokeGuardedCallback;
      var hasCaughtError$1 = ReactErrorUtils.hasCaughtError;
      var clearCaughtError$1 = ReactErrorUtils.clearCaughtError;
      var ReactFiberCommitWork = function(config, captureError) {
        var getPublicInstance = config.getPublicInstance,
            mutation = config.mutation,
            persistence = config.persistence;
        var callComponentWillUnmountWithTimer = function(current, instance) {
          startPhaseTimer(current, 'componentWillUnmount');
          instance.props = current.memoizedProps;
          instance.state = current.memoizedState;
          instance.componentWillUnmount();
          stopPhaseTimer();
        };
        function safelyCallComponentWillUnmount(current, instance) {
          {
            invokeGuardedCallback$2(null, callComponentWillUnmountWithTimer, null, current, instance);
            if (hasCaughtError$1()) {
              var unmountError = clearCaughtError$1();
              captureError(current, unmountError);
            }
          }
        }
        function safelyDetachRef(current) {
          var ref = current.ref;
          if (ref !== null) {
            {
              invokeGuardedCallback$2(null, ref, null, null);
              if (hasCaughtError$1()) {
                var refError = clearCaughtError$1();
                captureError(current, refError);
              }
            }
          }
        }
        function commitLifeCycles(current, finishedWork) {
          switch (finishedWork.tag) {
            case ClassComponent:
              {
                var instance = finishedWork.stateNode;
                if (finishedWork.effectTag & Update) {
                  if (current === null) {
                    startPhaseTimer(finishedWork, 'componentDidMount');
                    instance.props = finishedWork.memoizedProps;
                    instance.state = finishedWork.memoizedState;
                    instance.componentDidMount();
                    stopPhaseTimer();
                  } else {
                    var prevProps = current.memoizedProps;
                    var prevState = current.memoizedState;
                    startPhaseTimer(finishedWork, 'componentDidUpdate');
                    instance.props = finishedWork.memoizedProps;
                    instance.state = finishedWork.memoizedState;
                    instance.componentDidUpdate(prevProps, prevState);
                    stopPhaseTimer();
                  }
                }
                var updateQueue = finishedWork.updateQueue;
                if (updateQueue !== null) {
                  commitCallbacks(updateQueue, instance);
                }
                return;
              }
            case HostRoot:
              {
                var _updateQueue = finishedWork.updateQueue;
                if (_updateQueue !== null) {
                  var _instance = finishedWork.child !== null ? finishedWork.child.stateNode : null;
                  commitCallbacks(_updateQueue, _instance);
                }
                return;
              }
            case HostComponent:
              {
                var _instance2 = finishedWork.stateNode;
                if (current === null && finishedWork.effectTag & Update) {
                  var type = finishedWork.type;
                  var props = finishedWork.memoizedProps;
                  commitMount(_instance2, type, props, finishedWork);
                }
                return;
              }
            case HostText:
              {
                return;
              }
            case HostPortal:
              {
                return;
              }
            default:
              {
                invariant(false, 'This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.');
              }
          }
        }
        function commitAttachRef(finishedWork) {
          var ref = finishedWork.ref;
          if (ref !== null) {
            var instance = finishedWork.stateNode;
            switch (finishedWork.tag) {
              case HostComponent:
                ref(getPublicInstance(instance));
                break;
              default:
                ref(instance);
            }
          }
        }
        function commitDetachRef(current) {
          var currentRef = current.ref;
          if (currentRef !== null) {
            currentRef(null);
          }
        }
        function commitUnmount(current) {
          if (typeof onCommitUnmount === 'function') {
            onCommitUnmount(current);
          }
          switch (current.tag) {
            case ClassComponent:
              {
                safelyDetachRef(current);
                var instance = current.stateNode;
                if (typeof instance.componentWillUnmount === 'function') {
                  safelyCallComponentWillUnmount(current, instance);
                }
                return;
              }
            case HostComponent:
              {
                safelyDetachRef(current);
                return;
              }
            case CallComponent:
              {
                commitNestedUnmounts(current.stateNode);
                return;
              }
            case HostPortal:
              {
                if (enableMutatingReconciler && mutation) {
                  unmountHostComponents(current);
                } else if (enablePersistentReconciler && persistence) {
                  emptyPortalContainer(current);
                }
                return;
              }
          }
        }
        function commitNestedUnmounts(root) {
          var node = root;
          while (true) {
            commitUnmount(node);
            if (node.child !== null && (!mutation || node.tag !== HostPortal)) {
              node.child['return'] = node;
              node = node.child;
              continue;
            }
            if (node === root) {
              return;
            }
            while (node.sibling === null) {
              if (node['return'] === null || node['return'] === root) {
                return;
              }
              node = node['return'];
            }
            node.sibling['return'] = node['return'];
            node = node.sibling;
          }
        }
        function detachFiber(current) {
          current['return'] = null;
          current.child = null;
          if (current.alternate) {
            current.alternate.child = null;
            current.alternate['return'] = null;
          }
        }
        if (!mutation) {
          var commitContainer = void 0;
          if (persistence) {
            var replaceContainerChildren = persistence.replaceContainerChildren,
                createContainerChildSet = persistence.createContainerChildSet;
            var emptyPortalContainer = function(current) {
              var portal = current.stateNode;
              var containerInfo = portal.containerInfo;
              var emptyChildSet = createContainerChildSet(containerInfo);
              replaceContainerChildren(containerInfo, emptyChildSet);
            };
            commitContainer = function(finishedWork) {
              switch (finishedWork.tag) {
                case ClassComponent:
                  {
                    return;
                  }
                case HostComponent:
                  {
                    return;
                  }
                case HostText:
                  {
                    return;
                  }
                case HostRoot:
                case HostPortal:
                  {
                    var portalOrRoot = finishedWork.stateNode;
                    var containerInfo = portalOrRoot.containerInfo,
                        _pendingChildren = portalOrRoot.pendingChildren;
                    replaceContainerChildren(containerInfo, _pendingChildren);
                    return;
                  }
                default:
                  {
                    invariant(false, 'This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.');
                  }
              }
            };
          } else {
            commitContainer = function(finishedWork) {};
          }
          if (enablePersistentReconciler || enableNoopReconciler) {
            return {
              commitResetTextContent: function(finishedWork) {},
              commitPlacement: function(finishedWork) {},
              commitDeletion: function(current) {
                commitNestedUnmounts(current);
                detachFiber(current);
              },
              commitWork: function(current, finishedWork) {
                commitContainer(finishedWork);
              },
              commitLifeCycles: commitLifeCycles,
              commitAttachRef: commitAttachRef,
              commitDetachRef: commitDetachRef
            };
          } else if (persistence) {
            invariant(false, 'Persistent reconciler is disabled.');
          } else {
            invariant(false, 'Noop reconciler is disabled.');
          }
        }
        var commitMount = mutation.commitMount,
            commitUpdate = mutation.commitUpdate,
            resetTextContent = mutation.resetTextContent,
            commitTextUpdate = mutation.commitTextUpdate,
            appendChild = mutation.appendChild,
            appendChildToContainer = mutation.appendChildToContainer,
            insertBefore = mutation.insertBefore,
            insertInContainerBefore = mutation.insertInContainerBefore,
            removeChild = mutation.removeChild,
            removeChildFromContainer = mutation.removeChildFromContainer;
        function getHostParentFiber(fiber) {
          var parent = fiber['return'];
          while (parent !== null) {
            if (isHostParent(parent)) {
              return parent;
            }
            parent = parent['return'];
          }
          invariant(false, 'Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.');
        }
        function isHostParent(fiber) {
          return fiber.tag === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal;
        }
        function getHostSibling(fiber) {
          var node = fiber;
          siblings: while (true) {
            while (node.sibling === null) {
              if (node['return'] === null || isHostParent(node['return'])) {
                return null;
              }
              node = node['return'];
            }
            node.sibling['return'] = node['return'];
            node = node.sibling;
            while (node.tag !== HostComponent && node.tag !== HostText) {
              if (node.effectTag & Placement) {
                continue siblings;
              }
              if (node.child === null || node.tag === HostPortal) {
                continue siblings;
              } else {
                node.child['return'] = node;
                node = node.child;
              }
            }
            if (!(node.effectTag & Placement)) {
              return node.stateNode;
            }
          }
        }
        function commitPlacement(finishedWork) {
          var parentFiber = getHostParentFiber(finishedWork);
          var parent = void 0;
          var isContainer = void 0;
          switch (parentFiber.tag) {
            case HostComponent:
              parent = parentFiber.stateNode;
              isContainer = false;
              break;
            case HostRoot:
              parent = parentFiber.stateNode.containerInfo;
              isContainer = true;
              break;
            case HostPortal:
              parent = parentFiber.stateNode.containerInfo;
              isContainer = true;
              break;
            default:
              invariant(false, 'Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.');
          }
          if (parentFiber.effectTag & ContentReset) {
            resetTextContent(parent);
            parentFiber.effectTag &= ~ContentReset;
          }
          var before = getHostSibling(finishedWork);
          var node = finishedWork;
          while (true) {
            if (node.tag === HostComponent || node.tag === HostText) {
              if (before) {
                if (isContainer) {
                  insertInContainerBefore(parent, node.stateNode, before);
                } else {
                  insertBefore(parent, node.stateNode, before);
                }
              } else {
                if (isContainer) {
                  appendChildToContainer(parent, node.stateNode);
                } else {
                  appendChild(parent, node.stateNode);
                }
              }
            } else if (node.tag === HostPortal) {} else if (node.child !== null) {
              node.child['return'] = node;
              node = node.child;
              continue;
            }
            if (node === finishedWork) {
              return;
            }
            while (node.sibling === null) {
              if (node['return'] === null || node['return'] === finishedWork) {
                return;
              }
              node = node['return'];
            }
            node.sibling['return'] = node['return'];
            node = node.sibling;
          }
        }
        function unmountHostComponents(current) {
          var node = current;
          var currentParentIsValid = false;
          var currentParent = void 0;
          var currentParentIsContainer = void 0;
          while (true) {
            if (!currentParentIsValid) {
              var parent = node['return'];
              findParent: while (true) {
                !(parent !== null) ? invariant(false, 'Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.') : void 0;
                switch (parent.tag) {
                  case HostComponent:
                    currentParent = parent.stateNode;
                    currentParentIsContainer = false;
                    break findParent;
                  case HostRoot:
                    currentParent = parent.stateNode.containerInfo;
                    currentParentIsContainer = true;
                    break findParent;
                  case HostPortal:
                    currentParent = parent.stateNode.containerInfo;
                    currentParentIsContainer = true;
                    break findParent;
                }
                parent = parent['return'];
              }
              currentParentIsValid = true;
            }
            if (node.tag === HostComponent || node.tag === HostText) {
              commitNestedUnmounts(node);
              if (currentParentIsContainer) {
                removeChildFromContainer(currentParent, node.stateNode);
              } else {
                removeChild(currentParent, node.stateNode);
              }
            } else if (node.tag === HostPortal) {
              currentParent = node.stateNode.containerInfo;
              if (node.child !== null) {
                node.child['return'] = node;
                node = node.child;
                continue;
              }
            } else {
              commitUnmount(node);
              if (node.child !== null) {
                node.child['return'] = node;
                node = node.child;
                continue;
              }
            }
            if (node === current) {
              return;
            }
            while (node.sibling === null) {
              if (node['return'] === null || node['return'] === current) {
                return;
              }
              node = node['return'];
              if (node.tag === HostPortal) {
                currentParentIsValid = false;
              }
            }
            node.sibling['return'] = node['return'];
            node = node.sibling;
          }
        }
        function commitDeletion(current) {
          unmountHostComponents(current);
          detachFiber(current);
        }
        function commitWork(current, finishedWork) {
          switch (finishedWork.tag) {
            case ClassComponent:
              {
                return;
              }
            case HostComponent:
              {
                var instance = finishedWork.stateNode;
                if (instance != null) {
                  var newProps = finishedWork.memoizedProps;
                  var oldProps = current !== null ? current.memoizedProps : newProps;
                  var type = finishedWork.type;
                  var updatePayload = finishedWork.updateQueue;
                  finishedWork.updateQueue = null;
                  if (updatePayload !== null) {
                    commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork);
                  }
                }
                return;
              }
            case HostText:
              {
                !(finishedWork.stateNode !== null) ? invariant(false, 'This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.') : void 0;
                var textInstance = finishedWork.stateNode;
                var newText = finishedWork.memoizedProps;
                var oldText = current !== null ? current.memoizedProps : newText;
                commitTextUpdate(textInstance, oldText, newText);
                return;
              }
            case HostRoot:
              {
                return;
              }
            default:
              {
                invariant(false, 'This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.');
              }
          }
        }
        function commitResetTextContent(current) {
          resetTextContent(current.stateNode);
        }
        if (enableMutatingReconciler) {
          return {
            commitResetTextContent: commitResetTextContent,
            commitPlacement: commitPlacement,
            commitDeletion: commitDeletion,
            commitWork: commitWork,
            commitLifeCycles: commitLifeCycles,
            commitAttachRef: commitAttachRef,
            commitDetachRef: commitDetachRef
          };
        } else {
          invariant(false, 'Mutating reconciler is disabled.');
        }
      };
      var NO_CONTEXT = {};
      var ReactFiberHostContext = function(config) {
        var getChildHostContext = config.getChildHostContext,
            getRootHostContext = config.getRootHostContext;
        var contextStackCursor = createCursor(NO_CONTEXT);
        var contextFiberStackCursor = createCursor(NO_CONTEXT);
        var rootInstanceStackCursor = createCursor(NO_CONTEXT);
        function requiredContext(c) {
          !(c !== NO_CONTEXT) ? invariant(false, 'Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          return c;
        }
        function getRootHostContainer() {
          var rootInstance = requiredContext(rootInstanceStackCursor.current);
          return rootInstance;
        }
        function pushHostContainer(fiber, nextRootInstance) {
          push(rootInstanceStackCursor, nextRootInstance, fiber);
          var nextRootContext = getRootHostContext(nextRootInstance);
          push(contextFiberStackCursor, fiber, fiber);
          push(contextStackCursor, nextRootContext, fiber);
        }
        function popHostContainer(fiber) {
          pop(contextStackCursor, fiber);
          pop(contextFiberStackCursor, fiber);
          pop(rootInstanceStackCursor, fiber);
        }
        function getHostContext() {
          var context = requiredContext(contextStackCursor.current);
          return context;
        }
        function pushHostContext(fiber) {
          var rootInstance = requiredContext(rootInstanceStackCursor.current);
          var context = requiredContext(contextStackCursor.current);
          var nextContext = getChildHostContext(context, fiber.type, rootInstance);
          if (context === nextContext) {
            return;
          }
          push(contextFiberStackCursor, fiber, fiber);
          push(contextStackCursor, nextContext, fiber);
        }
        function popHostContext(fiber) {
          if (contextFiberStackCursor.current !== fiber) {
            return;
          }
          pop(contextStackCursor, fiber);
          pop(contextFiberStackCursor, fiber);
        }
        function resetHostContainer() {
          contextStackCursor.current = NO_CONTEXT;
          rootInstanceStackCursor.current = NO_CONTEXT;
        }
        return {
          getHostContext: getHostContext,
          getRootHostContainer: getRootHostContainer,
          popHostContainer: popHostContainer,
          popHostContext: popHostContext,
          pushHostContainer: pushHostContainer,
          pushHostContext: pushHostContext,
          resetHostContainer: resetHostContainer
        };
      };
      var ReactFiberHydrationContext = function(config) {
        var shouldSetTextContent = config.shouldSetTextContent,
            hydration = config.hydration;
        if (!hydration) {
          return {
            enterHydrationState: function() {
              return false;
            },
            resetHydrationState: function() {},
            tryToClaimNextHydratableInstance: function() {},
            prepareToHydrateHostInstance: function() {
              invariant(false, 'Expected prepareToHydrateHostInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.');
            },
            prepareToHydrateHostTextInstance: function() {
              invariant(false, 'Expected prepareToHydrateHostTextInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.');
            },
            popHydrationState: function(fiber) {
              return false;
            }
          };
        }
        var canHydrateInstance = hydration.canHydrateInstance,
            canHydrateTextInstance = hydration.canHydrateTextInstance,
            getNextHydratableSibling = hydration.getNextHydratableSibling,
            getFirstHydratableChild = hydration.getFirstHydratableChild,
            hydrateInstance = hydration.hydrateInstance,
            hydrateTextInstance = hydration.hydrateTextInstance,
            didNotMatchHydratedContainerTextInstance = hydration.didNotMatchHydratedContainerTextInstance,
            didNotMatchHydratedTextInstance = hydration.didNotMatchHydratedTextInstance,
            didNotHydrateContainerInstance = hydration.didNotHydrateContainerInstance,
            didNotHydrateInstance = hydration.didNotHydrateInstance,
            didNotFindHydratableContainerInstance = hydration.didNotFindHydratableContainerInstance,
            didNotFindHydratableContainerTextInstance = hydration.didNotFindHydratableContainerTextInstance,
            didNotFindHydratableInstance = hydration.didNotFindHydratableInstance,
            didNotFindHydratableTextInstance = hydration.didNotFindHydratableTextInstance;
        var hydrationParentFiber = null;
        var nextHydratableInstance = null;
        var isHydrating = false;
        function enterHydrationState(fiber) {
          var parentInstance = fiber.stateNode.containerInfo;
          nextHydratableInstance = getFirstHydratableChild(parentInstance);
          hydrationParentFiber = fiber;
          isHydrating = true;
          return true;
        }
        function deleteHydratableInstance(returnFiber, instance) {
          {
            switch (returnFiber.tag) {
              case HostRoot:
                didNotHydrateContainerInstance(returnFiber.stateNode.containerInfo, instance);
                break;
              case HostComponent:
                didNotHydrateInstance(returnFiber.type, returnFiber.memoizedProps, returnFiber.stateNode, instance);
                break;
            }
          }
          var childToDelete = createFiberFromHostInstanceForDeletion();
          childToDelete.stateNode = instance;
          childToDelete['return'] = returnFiber;
          childToDelete.effectTag = Deletion;
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = childToDelete;
            returnFiber.lastEffect = childToDelete;
          } else {
            returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
          }
        }
        function insertNonHydratedInstance(returnFiber, fiber) {
          fiber.effectTag |= Placement;
          {
            switch (returnFiber.tag) {
              case HostRoot:
                {
                  var parentContainer = returnFiber.stateNode.containerInfo;
                  switch (fiber.tag) {
                    case HostComponent:
                      var type = fiber.type;
                      var props = fiber.pendingProps;
                      didNotFindHydratableContainerInstance(parentContainer, type, props);
                      break;
                    case HostText:
                      var text = fiber.pendingProps;
                      didNotFindHydratableContainerTextInstance(parentContainer, text);
                      break;
                  }
                  break;
                }
              case HostComponent:
                {
                  var parentType = returnFiber.type;
                  var parentProps = returnFiber.memoizedProps;
                  var parentInstance = returnFiber.stateNode;
                  switch (fiber.tag) {
                    case HostComponent:
                      var _type = fiber.type;
                      var _props = fiber.pendingProps;
                      didNotFindHydratableInstance(parentType, parentProps, parentInstance, _type, _props);
                      break;
                    case HostText:
                      var _text = fiber.pendingProps;
                      didNotFindHydratableTextInstance(parentType, parentProps, parentInstance, _text);
                      break;
                  }
                  break;
                }
              default:
                return;
            }
          }
        }
        function canHydrate(fiber, nextInstance) {
          switch (fiber.tag) {
            case HostComponent:
              {
                var type = fiber.type;
                var props = fiber.pendingProps;
                return canHydrateInstance(nextInstance, type, props);
              }
            case HostText:
              {
                var text = fiber.pendingProps;
                return canHydrateTextInstance(nextInstance, text);
              }
            default:
              return false;
          }
        }
        function tryToClaimNextHydratableInstance(fiber) {
          if (!isHydrating) {
            return;
          }
          var nextInstance = nextHydratableInstance;
          if (!nextInstance) {
            insertNonHydratedInstance(hydrationParentFiber, fiber);
            isHydrating = false;
            hydrationParentFiber = fiber;
            return;
          }
          if (!canHydrate(fiber, nextInstance)) {
            nextInstance = getNextHydratableSibling(nextInstance);
            if (!nextInstance || !canHydrate(fiber, nextInstance)) {
              insertNonHydratedInstance(hydrationParentFiber, fiber);
              isHydrating = false;
              hydrationParentFiber = fiber;
              return;
            }
            deleteHydratableInstance(hydrationParentFiber, nextHydratableInstance);
          }
          fiber.stateNode = nextInstance;
          hydrationParentFiber = fiber;
          nextHydratableInstance = getFirstHydratableChild(nextInstance);
        }
        function prepareToHydrateHostInstance(fiber, rootContainerInstance, hostContext) {
          var instance = fiber.stateNode;
          var updatePayload = hydrateInstance(instance, fiber.type, fiber.memoizedProps, rootContainerInstance, hostContext, fiber);
          fiber.updateQueue = updatePayload;
          if (updatePayload !== null) {
            return true;
          }
          return false;
        }
        function prepareToHydrateHostTextInstance(fiber) {
          var textInstance = fiber.stateNode;
          var textContent = fiber.memoizedProps;
          var shouldUpdate = hydrateTextInstance(textInstance, textContent, fiber);
          {
            if (shouldUpdate) {
              var returnFiber = hydrationParentFiber;
              if (returnFiber !== null) {
                switch (returnFiber.tag) {
                  case HostRoot:
                    {
                      var parentContainer = returnFiber.stateNode.containerInfo;
                      didNotMatchHydratedContainerTextInstance(parentContainer, textInstance, textContent);
                      break;
                    }
                  case HostComponent:
                    {
                      var parentType = returnFiber.type;
                      var parentProps = returnFiber.memoizedProps;
                      var parentInstance = returnFiber.stateNode;
                      didNotMatchHydratedTextInstance(parentType, parentProps, parentInstance, textInstance, textContent);
                      break;
                    }
                }
              }
            }
          }
          return shouldUpdate;
        }
        function popToNextHostParent(fiber) {
          var parent = fiber['return'];
          while (parent !== null && parent.tag !== HostComponent && parent.tag !== HostRoot) {
            parent = parent['return'];
          }
          hydrationParentFiber = parent;
        }
        function popHydrationState(fiber) {
          if (fiber !== hydrationParentFiber) {
            return false;
          }
          if (!isHydrating) {
            popToNextHostParent(fiber);
            isHydrating = true;
            return false;
          }
          var type = fiber.type;
          if (fiber.tag !== HostComponent || type !== 'head' && type !== 'body' && !shouldSetTextContent(type, fiber.memoizedProps)) {
            var nextInstance = nextHydratableInstance;
            while (nextInstance) {
              deleteHydratableInstance(fiber, nextInstance);
              nextInstance = getNextHydratableSibling(nextInstance);
            }
          }
          popToNextHostParent(fiber);
          nextHydratableInstance = hydrationParentFiber ? getNextHydratableSibling(fiber.stateNode) : null;
          return true;
        }
        function resetHydrationState() {
          hydrationParentFiber = null;
          nextHydratableInstance = null;
          isHydrating = false;
        }
        return {
          enterHydrationState: enterHydrationState,
          resetHydrationState: resetHydrationState,
          tryToClaimNextHydratableInstance: tryToClaimNextHydratableInstance,
          prepareToHydrateHostInstance: prepareToHydrateHostInstance,
          prepareToHydrateHostTextInstance: prepareToHydrateHostTextInstance,
          popHydrationState: popHydrationState
        };
      };
      var ReactFiberInstrumentation = {debugTool: null};
      var ReactFiberInstrumentation_1 = ReactFiberInstrumentation;
      var defaultShowDialog = function(capturedError) {
        return true;
      };
      var showDialog = defaultShowDialog;
      function logCapturedError(capturedError) {
        var logError = showDialog(capturedError);
        if (logError === false) {
          return;
        }
        {
          var componentName = capturedError.componentName,
              componentStack = capturedError.componentStack,
              errorBoundaryName = capturedError.errorBoundaryName,
              errorBoundaryFound = capturedError.errorBoundaryFound,
              willRetry = capturedError.willRetry;
          var componentNameMessage = componentName ? 'The above error occurred in the <' + componentName + '> component:' : 'The above error occurred in one of your React components:';
          var errorBoundaryMessage = void 0;
          if (errorBoundaryFound && errorBoundaryName) {
            if (willRetry) {
              errorBoundaryMessage = 'React will try to recreate this component tree from scratch ' + ('using the error boundary you provided, ' + errorBoundaryName + '.');
            } else {
              errorBoundaryMessage = 'This error was initially handled by the error boundary ' + errorBoundaryName + '.\n' + 'Recreating the tree from scratch failed so React will unmount the tree.';
            }
          } else {
            errorBoundaryMessage = 'Consider adding an error boundary to your tree to customize error handling behavior.\n' + 'Visit https://fb.me/react-error-boundaries to learn more about error boundaries.';
          }
          var combinedMessage = '' + componentNameMessage + componentStack + '\n\n' + ('' + errorBoundaryMessage);
          console.error(combinedMessage);
        }
      }
      var invokeGuardedCallback$1 = ReactErrorUtils.invokeGuardedCallback;
      var hasCaughtError = ReactErrorUtils.hasCaughtError;
      var clearCaughtError = ReactErrorUtils.clearCaughtError;
      {
        var didWarnAboutStateTransition = false;
        var didWarnSetStateChildContext = false;
        var didWarnStateUpdateForUnmountedComponent = {};
        var warnAboutUpdateOnUnmounted = function(fiber) {
          var componentName = getComponentName(fiber) || 'ReactClass';
          if (didWarnStateUpdateForUnmountedComponent[componentName]) {
            return;
          }
          warning(false, 'Can only update a mounted or mounting ' + 'component. This usually means you called setState, replaceState, ' + 'or forceUpdate on an unmounted component. This is a no-op.\n\nPlease ' + 'check the code for the %s component.', componentName);
          didWarnStateUpdateForUnmountedComponent[componentName] = true;
        };
        var warnAboutInvalidUpdates = function(instance) {
          switch (ReactDebugCurrentFiber.phase) {
            case 'getChildContext':
              if (didWarnSetStateChildContext) {
                return;
              }
              warning(false, 'setState(...): Cannot call setState() inside getChildContext()');
              didWarnSetStateChildContext = true;
              break;
            case 'render':
              if (didWarnAboutStateTransition) {
                return;
              }
              warning(false, 'Cannot update during an existing state transition (such as within ' + "`render` or another component's constructor). Render methods should " + 'be a pure function of props and state; constructor side-effects are ' + 'an anti-pattern, but can be moved to `componentWillMount`.');
              didWarnAboutStateTransition = true;
              break;
          }
        };
      }
      var ReactFiberScheduler = function(config) {
        var hostContext = ReactFiberHostContext(config);
        var hydrationContext = ReactFiberHydrationContext(config);
        var popHostContainer = hostContext.popHostContainer,
            popHostContext = hostContext.popHostContext,
            resetHostContainer = hostContext.resetHostContainer;
        var _ReactFiberBeginWork = ReactFiberBeginWork(config, hostContext, hydrationContext, scheduleWork, computeExpirationForFiber),
            beginWork = _ReactFiberBeginWork.beginWork,
            beginFailedWork = _ReactFiberBeginWork.beginFailedWork;
        var _ReactFiberCompleteWo = ReactFiberCompleteWork(config, hostContext, hydrationContext),
            completeWork = _ReactFiberCompleteWo.completeWork;
        var _ReactFiberCommitWork = ReactFiberCommitWork(config, captureError),
            commitResetTextContent = _ReactFiberCommitWork.commitResetTextContent,
            commitPlacement = _ReactFiberCommitWork.commitPlacement,
            commitDeletion = _ReactFiberCommitWork.commitDeletion,
            commitWork = _ReactFiberCommitWork.commitWork,
            commitLifeCycles = _ReactFiberCommitWork.commitLifeCycles,
            commitAttachRef = _ReactFiberCommitWork.commitAttachRef,
            commitDetachRef = _ReactFiberCommitWork.commitDetachRef;
        var now = config.now,
            scheduleDeferredCallback = config.scheduleDeferredCallback,
            useSyncScheduling = config.useSyncScheduling,
            prepareForCommit = config.prepareForCommit,
            resetAfterCommit = config.resetAfterCommit;
        var startTime = now();
        var mostRecentCurrentTime = msToExpirationTime(0);
        var expirationContext = NoWork;
        var isWorking = false;
        var nextUnitOfWork = null;
        var nextRoot = null;
        var nextRenderExpirationTime = NoWork;
        var nextEffect = null;
        var capturedErrors = null;
        var failedBoundaries = null;
        var commitPhaseBoundaries = null;
        var firstUncaughtError = null;
        var didFatal = false;
        var isCommitting = false;
        var isUnmounting = false;
        var interruptedBy = null;
        function resetContextStack() {
          reset$1();
          resetContext();
          resetHostContainer();
        }
        function commitAllHostEffects() {
          while (nextEffect !== null) {
            {
              ReactDebugCurrentFiber.setCurrentFiber(nextEffect);
            }
            recordEffect();
            var effectTag = nextEffect.effectTag;
            if (effectTag & ContentReset) {
              commitResetTextContent(nextEffect);
            }
            if (effectTag & Ref) {
              var current = nextEffect.alternate;
              if (current !== null) {
                commitDetachRef(current);
              }
            }
            var primaryEffectTag = effectTag & ~(Callback | Err | ContentReset | Ref | PerformedWork);
            switch (primaryEffectTag) {
              case Placement:
                {
                  commitPlacement(nextEffect);
                  nextEffect.effectTag &= ~Placement;
                  break;
                }
              case PlacementAndUpdate:
                {
                  commitPlacement(nextEffect);
                  nextEffect.effectTag &= ~Placement;
                  var _current = nextEffect.alternate;
                  commitWork(_current, nextEffect);
                  break;
                }
              case Update:
                {
                  var _current2 = nextEffect.alternate;
                  commitWork(_current2, nextEffect);
                  break;
                }
              case Deletion:
                {
                  isUnmounting = true;
                  commitDeletion(nextEffect);
                  isUnmounting = false;
                  break;
                }
            }
            nextEffect = nextEffect.nextEffect;
          }
          {
            ReactDebugCurrentFiber.resetCurrentFiber();
          }
        }
        function commitAllLifeCycles() {
          while (nextEffect !== null) {
            var effectTag = nextEffect.effectTag;
            if (effectTag & (Update | Callback)) {
              recordEffect();
              var current = nextEffect.alternate;
              commitLifeCycles(current, nextEffect);
            }
            if (effectTag & Ref) {
              recordEffect();
              commitAttachRef(nextEffect);
            }
            if (effectTag & Err) {
              recordEffect();
              commitErrorHandling(nextEffect);
            }
            var next = nextEffect.nextEffect;
            nextEffect.nextEffect = null;
            nextEffect = next;
          }
        }
        function commitRoot(finishedWork) {
          isWorking = true;
          isCommitting = true;
          startCommitTimer();
          var root = finishedWork.stateNode;
          !(root.current !== finishedWork) ? invariant(false, 'Cannot commit the same tree as before. This is probably a bug related to the return field. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          root.isReadyForCommit = false;
          ReactCurrentOwner.current = null;
          var firstEffect = void 0;
          if (finishedWork.effectTag > PerformedWork) {
            if (finishedWork.lastEffect !== null) {
              finishedWork.lastEffect.nextEffect = finishedWork;
              firstEffect = finishedWork.firstEffect;
            } else {
              firstEffect = finishedWork;
            }
          } else {
            firstEffect = finishedWork.firstEffect;
          }
          prepareForCommit();
          nextEffect = firstEffect;
          startCommitHostEffectsTimer();
          while (nextEffect !== null) {
            var didError = false;
            var _error = void 0;
            {
              invokeGuardedCallback$1(null, commitAllHostEffects, null);
              if (hasCaughtError()) {
                didError = true;
                _error = clearCaughtError();
              }
            }
            if (didError) {
              !(nextEffect !== null) ? invariant(false, 'Should have next effect. This error is likely caused by a bug in React. Please file an issue.') : void 0;
              captureError(nextEffect, _error);
              if (nextEffect !== null) {
                nextEffect = nextEffect.nextEffect;
              }
            }
          }
          stopCommitHostEffectsTimer();
          resetAfterCommit();
          root.current = finishedWork;
          nextEffect = firstEffect;
          startCommitLifeCyclesTimer();
          while (nextEffect !== null) {
            var _didError = false;
            var _error2 = void 0;
            {
              invokeGuardedCallback$1(null, commitAllLifeCycles, null);
              if (hasCaughtError()) {
                _didError = true;
                _error2 = clearCaughtError();
              }
            }
            if (_didError) {
              !(nextEffect !== null) ? invariant(false, 'Should have next effect. This error is likely caused by a bug in React. Please file an issue.') : void 0;
              captureError(nextEffect, _error2);
              if (nextEffect !== null) {
                nextEffect = nextEffect.nextEffect;
              }
            }
          }
          isCommitting = false;
          isWorking = false;
          stopCommitLifeCyclesTimer();
          stopCommitTimer();
          if (typeof onCommitRoot === 'function') {
            onCommitRoot(finishedWork.stateNode);
          }
          if (true && ReactFiberInstrumentation_1.debugTool) {
            ReactFiberInstrumentation_1.debugTool.onCommitWork(finishedWork);
          }
          if (commitPhaseBoundaries) {
            commitPhaseBoundaries.forEach(scheduleErrorRecovery);
            commitPhaseBoundaries = null;
          }
          if (firstUncaughtError !== null) {
            var _error3 = firstUncaughtError;
            firstUncaughtError = null;
            onUncaughtError(_error3);
          }
          var remainingTime = root.current.expirationTime;
          if (remainingTime === NoWork) {
            capturedErrors = null;
            failedBoundaries = null;
          }
          return remainingTime;
        }
        function resetExpirationTime(workInProgress, renderTime) {
          if (renderTime !== Never && workInProgress.expirationTime === Never) {
            return;
          }
          var newExpirationTime = getUpdateExpirationTime(workInProgress);
          var child = workInProgress.child;
          while (child !== null) {
            if (child.expirationTime !== NoWork && (newExpirationTime === NoWork || newExpirationTime > child.expirationTime)) {
              newExpirationTime = child.expirationTime;
            }
            child = child.sibling;
          }
          workInProgress.expirationTime = newExpirationTime;
        }
        function completeUnitOfWork(workInProgress) {
          while (true) {
            var current = workInProgress.alternate;
            {
              ReactDebugCurrentFiber.setCurrentFiber(workInProgress);
            }
            var next = completeWork(current, workInProgress, nextRenderExpirationTime);
            {
              ReactDebugCurrentFiber.resetCurrentFiber();
            }
            var returnFiber = workInProgress['return'];
            var siblingFiber = workInProgress.sibling;
            resetExpirationTime(workInProgress, nextRenderExpirationTime);
            if (next !== null) {
              stopWorkTimer(workInProgress);
              if (true && ReactFiberInstrumentation_1.debugTool) {
                ReactFiberInstrumentation_1.debugTool.onCompleteWork(workInProgress);
              }
              return next;
            }
            if (returnFiber !== null) {
              if (returnFiber.firstEffect === null) {
                returnFiber.firstEffect = workInProgress.firstEffect;
              }
              if (workInProgress.lastEffect !== null) {
                if (returnFiber.lastEffect !== null) {
                  returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
                }
                returnFiber.lastEffect = workInProgress.lastEffect;
              }
              var effectTag = workInProgress.effectTag;
              if (effectTag > PerformedWork) {
                if (returnFiber.lastEffect !== null) {
                  returnFiber.lastEffect.nextEffect = workInProgress;
                } else {
                  returnFiber.firstEffect = workInProgress;
                }
                returnFiber.lastEffect = workInProgress;
              }
            }
            stopWorkTimer(workInProgress);
            if (true && ReactFiberInstrumentation_1.debugTool) {
              ReactFiberInstrumentation_1.debugTool.onCompleteWork(workInProgress);
            }
            if (siblingFiber !== null) {
              return siblingFiber;
            } else if (returnFiber !== null) {
              workInProgress = returnFiber;
              continue;
            } else {
              var root = workInProgress.stateNode;
              root.isReadyForCommit = true;
              return null;
            }
          }
          return null;
        }
        function performUnitOfWork(workInProgress) {
          var current = workInProgress.alternate;
          startWorkTimer(workInProgress);
          {
            ReactDebugCurrentFiber.setCurrentFiber(workInProgress);
          }
          var next = beginWork(current, workInProgress, nextRenderExpirationTime);
          {
            ReactDebugCurrentFiber.resetCurrentFiber();
          }
          if (true && ReactFiberInstrumentation_1.debugTool) {
            ReactFiberInstrumentation_1.debugTool.onBeginWork(workInProgress);
          }
          if (next === null) {
            next = completeUnitOfWork(workInProgress);
          }
          ReactCurrentOwner.current = null;
          return next;
        }
        function performFailedUnitOfWork(workInProgress) {
          var current = workInProgress.alternate;
          startWorkTimer(workInProgress);
          {
            ReactDebugCurrentFiber.setCurrentFiber(workInProgress);
          }
          var next = beginFailedWork(current, workInProgress, nextRenderExpirationTime);
          {
            ReactDebugCurrentFiber.resetCurrentFiber();
          }
          if (true && ReactFiberInstrumentation_1.debugTool) {
            ReactFiberInstrumentation_1.debugTool.onBeginWork(workInProgress);
          }
          if (next === null) {
            next = completeUnitOfWork(workInProgress);
          }
          ReactCurrentOwner.current = null;
          return next;
        }
        function workLoop(expirationTime) {
          if (capturedErrors !== null) {
            slowWorkLoopThatChecksForFailedWork(expirationTime);
            return;
          }
          if (nextRenderExpirationTime === NoWork || nextRenderExpirationTime > expirationTime) {
            return;
          }
          if (nextRenderExpirationTime <= mostRecentCurrentTime) {
            while (nextUnitOfWork !== null) {
              nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
            }
          } else {
            while (nextUnitOfWork !== null && !shouldYield()) {
              nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
            }
          }
        }
        function slowWorkLoopThatChecksForFailedWork(expirationTime) {
          if (nextRenderExpirationTime === NoWork || nextRenderExpirationTime > expirationTime) {
            return;
          }
          if (nextRenderExpirationTime <= mostRecentCurrentTime) {
            while (nextUnitOfWork !== null) {
              if (hasCapturedError(nextUnitOfWork)) {
                nextUnitOfWork = performFailedUnitOfWork(nextUnitOfWork);
              } else {
                nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
              }
            }
          } else {
            while (nextUnitOfWork !== null && !shouldYield()) {
              if (hasCapturedError(nextUnitOfWork)) {
                nextUnitOfWork = performFailedUnitOfWork(nextUnitOfWork);
              } else {
                nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
              }
            }
          }
        }
        function renderRootCatchBlock(root, failedWork, boundary, expirationTime) {
          unwindContexts(failedWork, boundary);
          nextUnitOfWork = performFailedUnitOfWork(boundary);
          workLoop(expirationTime);
        }
        function renderRoot(root, expirationTime) {
          !!isWorking ? invariant(false, 'renderRoot was called recursively. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          isWorking = true;
          root.isReadyForCommit = false;
          if (root !== nextRoot || expirationTime !== nextRenderExpirationTime || nextUnitOfWork === null) {
            resetContextStack();
            nextRoot = root;
            nextRenderExpirationTime = expirationTime;
            nextUnitOfWork = createWorkInProgress(nextRoot.current, null, expirationTime);
          }
          startWorkLoopTimer(nextUnitOfWork);
          var didError = false;
          var error = null;
          {
            invokeGuardedCallback$1(null, workLoop, null, expirationTime);
            if (hasCaughtError()) {
              didError = true;
              error = clearCaughtError();
            }
          }
          while (didError) {
            if (didFatal) {
              firstUncaughtError = error;
              break;
            }
            var failedWork = nextUnitOfWork;
            if (failedWork === null) {
              didFatal = true;
              continue;
            }
            var boundary = captureError(failedWork, error);
            !(boundary !== null) ? invariant(false, 'Should have found an error boundary. This error is likely caused by a bug in React. Please file an issue.') : void 0;
            if (didFatal) {
              continue;
            }
            didError = false;
            error = null;
            {
              invokeGuardedCallback$1(null, renderRootCatchBlock, null, root, failedWork, boundary, expirationTime);
              if (hasCaughtError()) {
                didError = true;
                error = clearCaughtError();
                continue;
              }
            }
            break;
          }
          var uncaughtError = firstUncaughtError;
          stopWorkLoopTimer(interruptedBy);
          interruptedBy = null;
          isWorking = false;
          didFatal = false;
          firstUncaughtError = null;
          if (uncaughtError !== null) {
            onUncaughtError(uncaughtError);
          }
          return root.isReadyForCommit ? root.current.alternate : null;
        }
        function captureError(failedWork, error) {
          ReactCurrentOwner.current = null;
          {
            ReactDebugCurrentFiber.resetCurrentFiber();
          }
          var boundary = null;
          var errorBoundaryFound = false;
          var willRetry = false;
          var errorBoundaryName = null;
          if (failedWork.tag === HostRoot) {
            boundary = failedWork;
            if (isFailedBoundary(failedWork)) {
              didFatal = true;
            }
          } else {
            var node = failedWork['return'];
            while (node !== null && boundary === null) {
              if (node.tag === ClassComponent) {
                var instance = node.stateNode;
                if (typeof instance.componentDidCatch === 'function') {
                  errorBoundaryFound = true;
                  errorBoundaryName = getComponentName(node);
                  boundary = node;
                  willRetry = true;
                }
              } else if (node.tag === HostRoot) {
                boundary = node;
              }
              if (isFailedBoundary(node)) {
                if (isUnmounting) {
                  return null;
                }
                if (commitPhaseBoundaries !== null && (commitPhaseBoundaries.has(node) || node.alternate !== null && commitPhaseBoundaries.has(node.alternate))) {
                  return null;
                }
                boundary = null;
                willRetry = false;
              }
              node = node['return'];
            }
          }
          if (boundary !== null) {
            if (failedBoundaries === null) {
              failedBoundaries = new Set();
            }
            failedBoundaries.add(boundary);
            var _componentStack = getStackAddendumByWorkInProgressFiber(failedWork);
            var _componentName = getComponentName(failedWork);
            if (capturedErrors === null) {
              capturedErrors = new Map();
            }
            var capturedError = {
              componentName: _componentName,
              componentStack: _componentStack,
              error: error,
              errorBoundary: errorBoundaryFound ? boundary.stateNode : null,
              errorBoundaryFound: errorBoundaryFound,
              errorBoundaryName: errorBoundaryName,
              willRetry: willRetry
            };
            capturedErrors.set(boundary, capturedError);
            try {
              logCapturedError(capturedError);
            } catch (e) {
              console.error(e);
            }
            if (isCommitting) {
              if (commitPhaseBoundaries === null) {
                commitPhaseBoundaries = new Set();
              }
              commitPhaseBoundaries.add(boundary);
            } else {
              scheduleErrorRecovery(boundary);
            }
            return boundary;
          } else if (firstUncaughtError === null) {
            firstUncaughtError = error;
          }
          return null;
        }
        function hasCapturedError(fiber) {
          return capturedErrors !== null && (capturedErrors.has(fiber) || fiber.alternate !== null && capturedErrors.has(fiber.alternate));
        }
        function isFailedBoundary(fiber) {
          return failedBoundaries !== null && (failedBoundaries.has(fiber) || fiber.alternate !== null && failedBoundaries.has(fiber.alternate));
        }
        function commitErrorHandling(effectfulFiber) {
          var capturedError = void 0;
          if (capturedErrors !== null) {
            capturedError = capturedErrors.get(effectfulFiber);
            capturedErrors['delete'](effectfulFiber);
            if (capturedError == null) {
              if (effectfulFiber.alternate !== null) {
                effectfulFiber = effectfulFiber.alternate;
                capturedError = capturedErrors.get(effectfulFiber);
                capturedErrors['delete'](effectfulFiber);
              }
            }
          }
          !(capturedError != null) ? invariant(false, 'No error for given unit of work. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          switch (effectfulFiber.tag) {
            case ClassComponent:
              var instance = effectfulFiber.stateNode;
              var info = {componentStack: capturedError.componentStack};
              instance.componentDidCatch(capturedError.error, info);
              return;
            case HostRoot:
              if (firstUncaughtError === null) {
                firstUncaughtError = capturedError.error;
              }
              return;
            default:
              invariant(false, 'Invalid type of work. This error is likely caused by a bug in React. Please file an issue.');
          }
        }
        function unwindContexts(from, to) {
          var node = from;
          while (node !== null) {
            switch (node.tag) {
              case ClassComponent:
                popContextProvider(node);
                break;
              case HostComponent:
                popHostContext(node);
                break;
              case HostRoot:
                popHostContainer(node);
                break;
              case HostPortal:
                popHostContainer(node);
                break;
            }
            if (node === to || node.alternate === to) {
              stopFailedWorkTimer(node);
              break;
            } else {
              stopWorkTimer(node);
            }
            node = node['return'];
          }
        }
        function computeAsyncExpiration() {
          var currentTime = recalculateCurrentTime();
          var expirationMs = 1000;
          var bucketSizeMs = 200;
          return computeExpirationBucket(currentTime, expirationMs, bucketSizeMs);
        }
        function computeExpirationForFiber(fiber) {
          var expirationTime = void 0;
          if (expirationContext !== NoWork) {
            expirationTime = expirationContext;
          } else if (isWorking) {
            if (isCommitting) {
              expirationTime = Sync;
            } else {
              expirationTime = nextRenderExpirationTime;
            }
          } else {
            if (useSyncScheduling && !(fiber.internalContextTag & AsyncUpdates)) {
              expirationTime = Sync;
            } else {
              expirationTime = computeAsyncExpiration();
            }
          }
          return expirationTime;
        }
        function scheduleWork(fiber, expirationTime) {
          return scheduleWorkImpl(fiber, expirationTime, false);
        }
        function scheduleWorkImpl(fiber, expirationTime, isErrorRecovery) {
          recordScheduleUpdate();
          {
            if (!isErrorRecovery && fiber.tag === ClassComponent) {
              var instance = fiber.stateNode;
              warnAboutInvalidUpdates(instance);
            }
          }
          var node = fiber;
          while (node !== null) {
            if (node.expirationTime === NoWork || node.expirationTime > expirationTime) {
              node.expirationTime = expirationTime;
            }
            if (node.alternate !== null) {
              if (node.alternate.expirationTime === NoWork || node.alternate.expirationTime > expirationTime) {
                node.alternate.expirationTime = expirationTime;
              }
            }
            if (node['return'] === null) {
              if (node.tag === HostRoot) {
                var root = node.stateNode;
                if (!isWorking && root === nextRoot && expirationTime <= nextRenderExpirationTime) {
                  if (nextUnitOfWork !== null) {
                    interruptedBy = fiber;
                  }
                  nextRoot = null;
                  nextUnitOfWork = null;
                  nextRenderExpirationTime = NoWork;
                }
                requestWork(root, expirationTime);
              } else {
                {
                  if (!isErrorRecovery && fiber.tag === ClassComponent) {
                    warnAboutUpdateOnUnmounted(fiber);
                  }
                }
                return;
              }
            }
            node = node['return'];
          }
        }
        function scheduleErrorRecovery(fiber) {
          scheduleWorkImpl(fiber, Sync, true);
        }
        function recalculateCurrentTime() {
          var ms = now() - startTime;
          mostRecentCurrentTime = msToExpirationTime(ms);
          return mostRecentCurrentTime;
        }
        function deferredUpdates(fn) {
          var previousExpirationContext = expirationContext;
          expirationContext = computeAsyncExpiration();
          try {
            return fn();
          } finally {
            expirationContext = previousExpirationContext;
          }
        }
        function syncUpdates(fn) {
          var previousExpirationContext = expirationContext;
          expirationContext = Sync;
          try {
            return fn();
          } finally {
            expirationContext = previousExpirationContext;
          }
        }
        var firstScheduledRoot = null;
        var lastScheduledRoot = null;
        var isCallbackScheduled = false;
        var isRendering = false;
        var nextFlushedRoot = null;
        var nextFlushedExpirationTime = NoWork;
        var deadlineDidExpire = false;
        var hasUnhandledError = false;
        var unhandledError = null;
        var deadline = null;
        var isBatchingUpdates = false;
        var isUnbatchingUpdates = false;
        var NESTED_UPDATE_LIMIT = 1000;
        var nestedUpdateCount = 0;
        var timeHeuristicForUnitOfWork = 1;
        function requestWork(root, expirationTime) {
          if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
            invariant(false, 'Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.');
          }
          if (root.nextScheduledRoot === null) {
            root.remainingExpirationTime = expirationTime;
            if (lastScheduledRoot === null) {
              firstScheduledRoot = lastScheduledRoot = root;
              root.nextScheduledRoot = root;
            } else {
              lastScheduledRoot.nextScheduledRoot = root;
              lastScheduledRoot = root;
              lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
            }
          } else {
            var remainingExpirationTime = root.remainingExpirationTime;
            if (remainingExpirationTime === NoWork || expirationTime < remainingExpirationTime) {
              root.remainingExpirationTime = expirationTime;
            }
          }
          if (isRendering) {
            return;
          }
          if (isBatchingUpdates) {
            if (isUnbatchingUpdates) {
              performWorkOnRoot(root, Sync);
            }
            return;
          }
          if (expirationTime === Sync) {
            performWork(Sync, null);
          } else if (!isCallbackScheduled) {
            isCallbackScheduled = true;
            scheduleDeferredCallback(performAsyncWork);
          }
        }
        function findHighestPriorityRoot() {
          var highestPriorityWork = NoWork;
          var highestPriorityRoot = null;
          if (lastScheduledRoot !== null) {
            var previousScheduledRoot = lastScheduledRoot;
            var root = firstScheduledRoot;
            while (root !== null) {
              var remainingExpirationTime = root.remainingExpirationTime;
              if (remainingExpirationTime === NoWork) {
                !(previousScheduledRoot !== null && lastScheduledRoot !== null) ? invariant(false, 'Should have a previous and last root. This error is likely caused by a bug in React. Please file an issue.') : void 0;
                if (root === root.nextScheduledRoot) {
                  root.nextScheduledRoot = null;
                  firstScheduledRoot = lastScheduledRoot = null;
                  break;
                } else if (root === firstScheduledRoot) {
                  var next = root.nextScheduledRoot;
                  firstScheduledRoot = next;
                  lastScheduledRoot.nextScheduledRoot = next;
                  root.nextScheduledRoot = null;
                } else if (root === lastScheduledRoot) {
                  lastScheduledRoot = previousScheduledRoot;
                  lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
                  root.nextScheduledRoot = null;
                  break;
                } else {
                  previousScheduledRoot.nextScheduledRoot = root.nextScheduledRoot;
                  root.nextScheduledRoot = null;
                }
                root = previousScheduledRoot.nextScheduledRoot;
              } else {
                if (highestPriorityWork === NoWork || remainingExpirationTime < highestPriorityWork) {
                  highestPriorityWork = remainingExpirationTime;
                  highestPriorityRoot = root;
                }
                if (root === lastScheduledRoot) {
                  break;
                }
                previousScheduledRoot = root;
                root = root.nextScheduledRoot;
              }
            }
          }
          var previousFlushedRoot = nextFlushedRoot;
          if (previousFlushedRoot !== null && previousFlushedRoot === highestPriorityRoot) {
            nestedUpdateCount++;
          } else {
            nestedUpdateCount = 0;
          }
          nextFlushedRoot = highestPriorityRoot;
          nextFlushedExpirationTime = highestPriorityWork;
        }
        function performAsyncWork(dl) {
          performWork(NoWork, dl);
        }
        function performWork(minExpirationTime, dl) {
          deadline = dl;
          findHighestPriorityRoot();
          while (nextFlushedRoot !== null && nextFlushedExpirationTime !== NoWork && (minExpirationTime === NoWork || nextFlushedExpirationTime <= minExpirationTime) && !deadlineDidExpire) {
            performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime);
            findHighestPriorityRoot();
          }
          if (deadline !== null) {
            isCallbackScheduled = false;
          }
          if (nextFlushedRoot !== null && !isCallbackScheduled) {
            isCallbackScheduled = true;
            scheduleDeferredCallback(performAsyncWork);
          }
          deadline = null;
          deadlineDidExpire = false;
          nestedUpdateCount = 0;
          if (hasUnhandledError) {
            var _error4 = unhandledError;
            unhandledError = null;
            hasUnhandledError = false;
            throw _error4;
          }
        }
        function performWorkOnRoot(root, expirationTime) {
          !!isRendering ? invariant(false, 'performWorkOnRoot was called recursively. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          isRendering = true;
          if (expirationTime <= recalculateCurrentTime()) {
            var finishedWork = root.finishedWork;
            if (finishedWork !== null) {
              root.finishedWork = null;
              root.remainingExpirationTime = commitRoot(finishedWork);
            } else {
              root.finishedWork = null;
              finishedWork = renderRoot(root, expirationTime);
              if (finishedWork !== null) {
                root.remainingExpirationTime = commitRoot(finishedWork);
              }
            }
          } else {
            var _finishedWork = root.finishedWork;
            if (_finishedWork !== null) {
              root.finishedWork = null;
              root.remainingExpirationTime = commitRoot(_finishedWork);
            } else {
              root.finishedWork = null;
              _finishedWork = renderRoot(root, expirationTime);
              if (_finishedWork !== null) {
                if (!shouldYield()) {
                  root.remainingExpirationTime = commitRoot(_finishedWork);
                } else {
                  root.finishedWork = _finishedWork;
                }
              }
            }
          }
          isRendering = false;
        }
        function shouldYield() {
          if (deadline === null) {
            return false;
          }
          if (deadline.timeRemaining() > timeHeuristicForUnitOfWork) {
            return false;
          }
          deadlineDidExpire = true;
          return true;
        }
        function onUncaughtError(error) {
          !(nextFlushedRoot !== null) ? invariant(false, 'Should be working on a root. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          nextFlushedRoot.remainingExpirationTime = NoWork;
          if (!hasUnhandledError) {
            hasUnhandledError = true;
            unhandledError = error;
          }
        }
        function batchedUpdates(fn, a) {
          var previousIsBatchingUpdates = isBatchingUpdates;
          isBatchingUpdates = true;
          try {
            return fn(a);
          } finally {
            isBatchingUpdates = previousIsBatchingUpdates;
            if (!isBatchingUpdates && !isRendering) {
              performWork(Sync, null);
            }
          }
        }
        function unbatchedUpdates(fn) {
          if (isBatchingUpdates && !isUnbatchingUpdates) {
            isUnbatchingUpdates = true;
            try {
              return fn();
            } finally {
              isUnbatchingUpdates = false;
            }
          }
          return fn();
        }
        function flushSync(fn) {
          var previousIsBatchingUpdates = isBatchingUpdates;
          isBatchingUpdates = true;
          try {
            return syncUpdates(fn);
          } finally {
            isBatchingUpdates = previousIsBatchingUpdates;
            !!isRendering ? invariant(false, 'flushSync was called from inside a lifecycle method. It cannot be called when React is already rendering.') : void 0;
            performWork(Sync, null);
          }
        }
        return {
          computeAsyncExpiration: computeAsyncExpiration,
          computeExpirationForFiber: computeExpirationForFiber,
          scheduleWork: scheduleWork,
          batchedUpdates: batchedUpdates,
          unbatchedUpdates: unbatchedUpdates,
          flushSync: flushSync,
          deferredUpdates: deferredUpdates
        };
      };
      {
        var didWarnAboutNestedUpdates = false;
      }
      function getContextForSubtree(parentComponent) {
        if (!parentComponent) {
          return emptyObject;
        }
        var fiber = get(parentComponent);
        var parentContext = findCurrentUnmaskedContext(fiber);
        return isContextProvider(fiber) ? processChildContext(fiber, parentContext) : parentContext;
      }
      var ReactFiberReconciler$1 = function(config) {
        var getPublicInstance = config.getPublicInstance;
        var _ReactFiberScheduler = ReactFiberScheduler(config),
            computeAsyncExpiration = _ReactFiberScheduler.computeAsyncExpiration,
            computeExpirationForFiber = _ReactFiberScheduler.computeExpirationForFiber,
            scheduleWork = _ReactFiberScheduler.scheduleWork,
            batchedUpdates = _ReactFiberScheduler.batchedUpdates,
            unbatchedUpdates = _ReactFiberScheduler.unbatchedUpdates,
            flushSync = _ReactFiberScheduler.flushSync,
            deferredUpdates = _ReactFiberScheduler.deferredUpdates;
        function scheduleTopLevelUpdate(current, element, callback) {
          {
            if (ReactDebugCurrentFiber.phase === 'render' && ReactDebugCurrentFiber.current !== null && !didWarnAboutNestedUpdates) {
              didWarnAboutNestedUpdates = true;
              warning(false, 'Render methods should be a pure function of props and state; ' + 'triggering nested component updates from render is not allowed. ' + 'If necessary, trigger nested updates in componentDidUpdate.\n\n' + 'Check the render method of %s.', getComponentName(ReactDebugCurrentFiber.current) || 'Unknown');
            }
          }
          callback = callback === undefined ? null : callback;
          {
            warning(callback === null || typeof callback === 'function', 'render(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callback);
          }
          var expirationTime = void 0;
          if (enableAsyncSubtreeAPI && element != null && element.type != null && element.type.prototype != null && element.type.prototype.unstable_isAsyncReactComponent === true) {
            expirationTime = computeAsyncExpiration();
          } else {
            expirationTime = computeExpirationForFiber(current);
          }
          var update = {
            expirationTime: expirationTime,
            partialState: {element: element},
            callback: callback,
            isReplace: false,
            isForced: false,
            nextCallback: null,
            next: null
          };
          insertUpdateIntoFiber(current, update);
          scheduleWork(current, expirationTime);
        }
        function findHostInstance(fiber) {
          var hostFiber = findCurrentHostFiber(fiber);
          if (hostFiber === null) {
            return null;
          }
          return hostFiber.stateNode;
        }
        return {
          createContainer: function(containerInfo, hydrate) {
            return createFiberRoot(containerInfo, hydrate);
          },
          updateContainer: function(element, container, parentComponent, callback) {
            var current = container.current;
            {
              if (ReactFiberInstrumentation_1.debugTool) {
                if (current.alternate === null) {
                  ReactFiberInstrumentation_1.debugTool.onMountContainer(container);
                } else if (element === null) {
                  ReactFiberInstrumentation_1.debugTool.onUnmountContainer(container);
                } else {
                  ReactFiberInstrumentation_1.debugTool.onUpdateContainer(container);
                }
              }
            }
            var context = getContextForSubtree(parentComponent);
            if (container.context === null) {
              container.context = context;
            } else {
              container.pendingContext = context;
            }
            scheduleTopLevelUpdate(current, element, callback);
          },
          batchedUpdates: batchedUpdates,
          unbatchedUpdates: unbatchedUpdates,
          deferredUpdates: deferredUpdates,
          flushSync: flushSync,
          getPublicRootInstance: function(container) {
            var containerFiber = container.current;
            if (!containerFiber.child) {
              return null;
            }
            switch (containerFiber.child.tag) {
              case HostComponent:
                return getPublicInstance(containerFiber.child.stateNode);
              default:
                return containerFiber.child.stateNode;
            }
          },
          findHostInstance: findHostInstance,
          findHostInstanceWithNoPortals: function(fiber) {
            var hostFiber = findCurrentHostFiberWithNoPortals(fiber);
            if (hostFiber === null) {
              return null;
            }
            return hostFiber.stateNode;
          },
          injectIntoDevTools: function(devToolsConfig) {
            var findFiberByHostInstance = devToolsConfig.findFiberByHostInstance;
            return injectInternals(_assign({}, devToolsConfig, {
              findHostInstanceByFiber: function(fiber) {
                return findHostInstance(fiber);
              },
              findFiberByHostInstance: function(instance) {
                if (!findFiberByHostInstance) {
                  return null;
                }
                return findFiberByHostInstance(instance);
              }
            }));
          }
        };
      };
      var ReactFiberReconciler$2 = Object.freeze({default: ReactFiberReconciler$1});
      var ReactFiberReconciler$3 = (ReactFiberReconciler$2 && ReactFiberReconciler$1) || ReactFiberReconciler$2;
      var reactReconciler = ReactFiberReconciler$3['default'] ? ReactFiberReconciler$3['default'] : ReactFiberReconciler$3;
      var ReactVersion = '16.1.0';
      {
        if (ExecutionEnvironment.canUseDOM && typeof requestAnimationFrame !== 'function') {
          warning(false, 'React depends on requestAnimationFrame. Make sure that you load a ' + 'polyfill in older browsers. http://fb.me/react-polyfills');
        }
      }
      var hasNativePerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';
      var now = void 0;
      if (hasNativePerformanceNow) {
        now = function() {
          return performance.now();
        };
      } else {
        now = function() {
          return Date.now();
        };
      }
      var rIC = void 0;
      if (!ExecutionEnvironment.canUseDOM) {
        rIC = function(frameCallback) {
          setTimeout(function() {
            frameCallback({timeRemaining: function() {
                return Infinity;
              }});
          });
          return 0;
        };
      } else if (typeof requestIdleCallback !== 'function') {
        var scheduledRICCallback = null;
        var isIdleScheduled = false;
        var isAnimationFrameScheduled = false;
        var frameDeadline = 0;
        var previousFrameTime = 33;
        var activeFrameTime = 33;
        var frameDeadlineObject;
        if (hasNativePerformanceNow) {
          frameDeadlineObject = {timeRemaining: function() {
              return frameDeadline - performance.now();
            }};
        } else {
          frameDeadlineObject = {timeRemaining: function() {
              return frameDeadline - Date.now();
            }};
        }
        var messageKey = '__reactIdleCallback$' + Math.random().toString(36).slice(2);
        var idleTick = function(event) {
          if (event.source !== window || event.data !== messageKey) {
            return;
          }
          isIdleScheduled = false;
          var callback = scheduledRICCallback;
          scheduledRICCallback = null;
          if (callback !== null) {
            callback(frameDeadlineObject);
          }
        };
        window.addEventListener('message', idleTick, false);
        var animationTick = function(rafTime) {
          isAnimationFrameScheduled = false;
          var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
          if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime) {
            if (nextFrameTime < 8) {
              nextFrameTime = 8;
            }
            activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
          } else {
            previousFrameTime = nextFrameTime;
          }
          frameDeadline = rafTime + activeFrameTime;
          if (!isIdleScheduled) {
            isIdleScheduled = true;
            window.postMessage(messageKey, '*');
          }
        };
        rIC = function(callback) {
          scheduledRICCallback = callback;
          if (!isAnimationFrameScheduled) {
            isAnimationFrameScheduled = true;
            requestAnimationFrame(animationTick);
          }
          return 0;
        };
      } else {
        rIC = requestIdleCallback;
      }
      var lowPriorityWarning = function() {};
      {
        var printWarning = function(format) {
          for (var _len = arguments.length,
              args = Array(_len > 1 ? _len - 1 : 0),
              _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          var argIndex = 0;
          var message = 'Warning: ' + format.replace(/%s/g, function() {
            return args[argIndex++];
          });
          if (typeof console !== 'undefined') {
            console.warn(message);
          }
          try {
            throw new Error(message);
          } catch (x) {}
        };
        lowPriorityWarning = function(condition, format) {
          if (format === undefined) {
            throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
          }
          if (!condition) {
            for (var _len2 = arguments.length,
                args = Array(_len2 > 2 ? _len2 - 2 : 0),
                _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }
            printWarning.apply(undefined, [format].concat(args));
          }
        };
      }
      var lowPriorityWarning$1 = lowPriorityWarning;
      var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');
      var illegalAttributeNameCache = {};
      var validatedAttributeNameCache = {};
      function isAttributeNameSafe(attributeName) {
        if (validatedAttributeNameCache.hasOwnProperty(attributeName)) {
          return true;
        }
        if (illegalAttributeNameCache.hasOwnProperty(attributeName)) {
          return false;
        }
        if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
          validatedAttributeNameCache[attributeName] = true;
          return true;
        }
        illegalAttributeNameCache[attributeName] = true;
        {
          warning(false, 'Invalid attribute name: `%s`', attributeName);
        }
        return false;
      }
      function shouldIgnoreValue(propertyInfo, value) {
        return value == null || propertyInfo.hasBooleanValue && !value || propertyInfo.hasNumericValue && isNaN(value) || propertyInfo.hasPositiveNumericValue && value < 1 || propertyInfo.hasOverloadedBooleanValue && value === false;
      }
      function getValueForProperty(node, name, expected) {
        {
          var propertyInfo = getPropertyInfo(name);
          if (propertyInfo) {
            var mutationMethod = propertyInfo.mutationMethod;
            if (mutationMethod || propertyInfo.mustUseProperty) {
              return node[propertyInfo.propertyName];
            } else {
              var attributeName = propertyInfo.attributeName;
              var stringValue = null;
              if (propertyInfo.hasOverloadedBooleanValue) {
                if (node.hasAttribute(attributeName)) {
                  var value = node.getAttribute(attributeName);
                  if (value === '') {
                    return true;
                  }
                  if (shouldIgnoreValue(propertyInfo, expected)) {
                    return value;
                  }
                  if (value === '' + expected) {
                    return expected;
                  }
                  return value;
                }
              } else if (node.hasAttribute(attributeName)) {
                if (shouldIgnoreValue(propertyInfo, expected)) {
                  return node.getAttribute(attributeName);
                }
                if (propertyInfo.hasBooleanValue) {
                  return expected;
                }
                stringValue = node.getAttribute(attributeName);
              }
              if (shouldIgnoreValue(propertyInfo, expected)) {
                return stringValue === null ? expected : stringValue;
              } else if (stringValue === '' + expected) {
                return expected;
              } else {
                return stringValue;
              }
            }
          }
        }
      }
      function getValueForAttribute(node, name, expected) {
        {
          if (!isAttributeNameSafe(name)) {
            return;
          }
          if (!node.hasAttribute(name)) {
            return expected === undefined ? undefined : null;
          }
          var value = node.getAttribute(name);
          if (value === '' + expected) {
            return expected;
          }
          return value;
        }
      }
      function setValueForProperty(node, name, value) {
        var propertyInfo = getPropertyInfo(name);
        if (propertyInfo && shouldSetAttribute(name, value)) {
          var mutationMethod = propertyInfo.mutationMethod;
          if (mutationMethod) {
            mutationMethod(node, value);
          } else if (shouldIgnoreValue(propertyInfo, value)) {
            deleteValueForProperty(node, name);
            return;
          } else if (propertyInfo.mustUseProperty) {
            node[propertyInfo.propertyName] = value;
          } else {
            var attributeName = propertyInfo.attributeName;
            var namespace = propertyInfo.attributeNamespace;
            if (namespace) {
              node.setAttributeNS(namespace, attributeName, '' + value);
            } else if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
              node.setAttribute(attributeName, '');
            } else {
              node.setAttribute(attributeName, '' + value);
            }
          }
        } else {
          setValueForAttribute(node, name, shouldSetAttribute(name, value) ? value : null);
          return;
        }
        {}
      }
      function setValueForAttribute(node, name, value) {
        if (!isAttributeNameSafe(name)) {
          return;
        }
        if (value == null) {
          node.removeAttribute(name);
        } else {
          node.setAttribute(name, '' + value);
        }
        {}
      }
      function deleteValueForAttribute(node, name) {
        node.removeAttribute(name);
      }
      function deleteValueForProperty(node, name) {
        var propertyInfo = getPropertyInfo(name);
        if (propertyInfo) {
          var mutationMethod = propertyInfo.mutationMethod;
          if (mutationMethod) {
            mutationMethod(node, undefined);
          } else if (propertyInfo.mustUseProperty) {
            var propName = propertyInfo.propertyName;
            if (propertyInfo.hasBooleanValue) {
              node[propName] = false;
            } else {
              node[propName] = '';
            }
          } else {
            node.removeAttribute(propertyInfo.attributeName);
          }
        } else {
          node.removeAttribute(name);
        }
      }
      var ReactControlledValuePropTypes = {checkPropTypes: null};
      {
        var hasReadOnlyValue = {
          button: true,
          checkbox: true,
          image: true,
          hidden: true,
          radio: true,
          reset: true,
          submit: true
        };
        var propTypes = {
          value: function(props, propName, componentName) {
            if (!props[propName] || hasReadOnlyValue[props.type] || props.onChange || props.readOnly || props.disabled) {
              return null;
            }
            return new Error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
          },
          checked: function(props, propName, componentName) {
            if (!props[propName] || props.onChange || props.readOnly || props.disabled) {
              return null;
            }
            return new Error('You provided a `checked` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
          }
        };
        ReactControlledValuePropTypes.checkPropTypes = function(tagName, props, getStack) {
          checkPropTypes(propTypes, props, 'prop', tagName, getStack);
        };
      }
      var getCurrentFiberOwnerName$2 = ReactDebugCurrentFiber.getCurrentFiberOwnerName;
      var getCurrentFiberStackAddendum$3 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;
      var didWarnValueDefaultValue = false;
      var didWarnCheckedDefaultChecked = false;
      var didWarnControlledToUncontrolled = false;
      var didWarnUncontrolledToControlled = false;
      function isControlled(props) {
        var usesChecked = props.type === 'checkbox' || props.type === 'radio';
        return usesChecked ? props.checked != null : props.value != null;
      }
      function getHostProps(element, props) {
        var node = element;
        var value = props.value;
        var checked = props.checked;
        var hostProps = _assign({
          type: undefined,
          step: undefined,
          min: undefined,
          max: undefined
        }, props, {
          defaultChecked: undefined,
          defaultValue: undefined,
          value: value != null ? value : node._wrapperState.initialValue,
          checked: checked != null ? checked : node._wrapperState.initialChecked
        });
        return hostProps;
      }
      function initWrapperState(element, props) {
        {
          ReactControlledValuePropTypes.checkPropTypes('input', props, getCurrentFiberStackAddendum$3);
          if (props.checked !== undefined && props.defaultChecked !== undefined && !didWarnCheckedDefaultChecked) {
            warning(false, '%s contains an input of type %s with both checked and defaultChecked props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the checked prop, or the defaultChecked prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', getCurrentFiberOwnerName$2() || 'A component', props.type);
            didWarnCheckedDefaultChecked = true;
          }
          if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValueDefaultValue) {
            warning(false, '%s contains an input of type %s with both value and defaultValue props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', getCurrentFiberOwnerName$2() || 'A component', props.type);
            didWarnValueDefaultValue = true;
          }
        }
        var defaultValue = props.defaultValue;
        var node = element;
        node._wrapperState = {
          initialChecked: props.checked != null ? props.checked : props.defaultChecked,
          initialValue: props.value != null ? props.value : defaultValue,
          controlled: isControlled(props)
        };
      }
      function updateWrapper(element, props) {
        var node = element;
        {
          var controlled = isControlled(props);
          if (!node._wrapperState.controlled && controlled && !didWarnUncontrolledToControlled) {
            warning(false, 'A component is changing an uncontrolled input of type %s to be controlled. ' + 'Input elements should not switch from uncontrolled to controlled (or vice versa). ' + 'Decide between using a controlled or uncontrolled input ' + 'element for the lifetime of the component. More info: https://fb.me/react-controlled-components%s', props.type, getCurrentFiberStackAddendum$3());
            didWarnUncontrolledToControlled = true;
          }
          if (node._wrapperState.controlled && !controlled && !didWarnControlledToUncontrolled) {
            warning(false, 'A component is changing a controlled input of type %s to be uncontrolled. ' + 'Input elements should not switch from controlled to uncontrolled (or vice versa). ' + 'Decide between using a controlled or uncontrolled input ' + 'element for the lifetime of the component. More info: https://fb.me/react-controlled-components%s', props.type, getCurrentFiberStackAddendum$3());
            didWarnControlledToUncontrolled = true;
          }
        }
        var checked = props.checked;
        if (checked != null) {
          setValueForProperty(node, 'checked', checked || false);
        }
        var value = props.value;
        if (value != null) {
          if (value === 0 && node.value === '') {
            node.value = '0';
          } else if (props.type === 'number') {
            var valueAsNumber = parseFloat(node.value) || 0;
            if (value != valueAsNumber || value == valueAsNumber && node.value != value) {
              node.value = '' + value;
            }
          } else if (node.value !== '' + value) {
            node.value = '' + value;
          }
        } else {
          if (props.value == null && props.defaultValue != null) {
            if (node.defaultValue !== '' + props.defaultValue) {
              node.defaultValue = '' + props.defaultValue;
            }
          }
          if (props.checked == null && props.defaultChecked != null) {
            node.defaultChecked = !!props.defaultChecked;
          }
        }
      }
      function postMountWrapper(element, props) {
        var node = element;
        switch (props.type) {
          case 'submit':
          case 'reset':
            break;
          case 'color':
          case 'date':
          case 'datetime':
          case 'datetime-local':
          case 'month':
          case 'time':
          case 'week':
            node.value = '';
            node.value = node.defaultValue;
            break;
          default:
            node.value = node.value;
            break;
        }
        var name = node.name;
        if (name !== '') {
          node.name = '';
        }
        node.defaultChecked = !node.defaultChecked;
        node.defaultChecked = !node.defaultChecked;
        if (name !== '') {
          node.name = name;
        }
      }
      function restoreControlledState$1(element, props) {
        var node = element;
        updateWrapper(node, props);
        updateNamedCousins(node, props);
      }
      function updateNamedCousins(rootNode, props) {
        var name = props.name;
        if (props.type === 'radio' && name != null) {
          var queryRoot = rootNode;
          while (queryRoot.parentNode) {
            queryRoot = queryRoot.parentNode;
          }
          var group = queryRoot.querySelectorAll('input[name=' + JSON.stringify('' + name) + '][type="radio"]');
          for (var i = 0; i < group.length; i++) {
            var otherNode = group[i];
            if (otherNode === rootNode || otherNode.form !== rootNode.form) {
              continue;
            }
            var otherProps = getFiberCurrentPropsFromNode$1(otherNode);
            !otherProps ? invariant(false, 'ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.') : void 0;
            updateWrapper(otherNode, otherProps);
          }
        }
      }
      function flattenChildren(children) {
        var content = '';
        React.Children.forEach(children, function(child) {
          if (child == null) {
            return;
          }
          if (typeof child === 'string' || typeof child === 'number') {
            content += child;
          }
        });
        return content;
      }
      function validateProps(element, props) {
        {
          warning(props.selected == null, 'Use the `defaultValue` or `value` props on <select> instead of ' + 'setting `selected` on <option>.');
        }
      }
      function postMountWrapper$1(element, props) {
        if (props.value != null) {
          element.setAttribute('value', props.value);
        }
      }
      function getHostProps$1(element, props) {
        var hostProps = _assign({children: undefined}, props);
        var content = flattenChildren(props.children);
        if (content) {
          hostProps.children = content;
        }
        return hostProps;
      }
      var getCurrentFiberOwnerName$3 = ReactDebugCurrentFiber.getCurrentFiberOwnerName;
      var getCurrentFiberStackAddendum$4 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;
      {
        var didWarnValueDefaultValue$1 = false;
      }
      function getDeclarationErrorAddendum() {
        var ownerName = getCurrentFiberOwnerName$3();
        if (ownerName) {
          return '\n\nCheck the render method of `' + ownerName + '`.';
        }
        return '';
      }
      var valuePropNames = ['value', 'defaultValue'];
      function checkSelectPropTypes(props) {
        ReactControlledValuePropTypes.checkPropTypes('select', props, getCurrentFiberStackAddendum$4);
        for (var i = 0; i < valuePropNames.length; i++) {
          var propName = valuePropNames[i];
          if (props[propName] == null) {
            continue;
          }
          var isArray = Array.isArray(props[propName]);
          if (props.multiple && !isArray) {
            warning(false, 'The `%s` prop supplied to <select> must be an array if ' + '`multiple` is true.%s', propName, getDeclarationErrorAddendum());
          } else if (!props.multiple && isArray) {
            warning(false, 'The `%s` prop supplied to <select> must be a scalar ' + 'value if `multiple` is false.%s', propName, getDeclarationErrorAddendum());
          }
        }
      }
      function updateOptions(node, multiple, propValue, setDefaultSelected) {
        var options = node.options;
        if (multiple) {
          var selectedValues = propValue;
          var selectedValue = {};
          for (var i = 0; i < selectedValues.length; i++) {
            selectedValue['$' + selectedValues[i]] = true;
          }
          for (var _i = 0; _i < options.length; _i++) {
            var selected = selectedValue.hasOwnProperty('$' + options[_i].value);
            if (options[_i].selected !== selected) {
              options[_i].selected = selected;
            }
            if (selected && setDefaultSelected) {
              options[_i].defaultSelected = true;
            }
          }
        } else {
          var _selectedValue = '' + propValue;
          var defaultSelected = null;
          for (var _i2 = 0; _i2 < options.length; _i2++) {
            if (options[_i2].value === _selectedValue) {
              options[_i2].selected = true;
              if (setDefaultSelected) {
                options[_i2].defaultSelected = true;
              }
              return;
            }
            if (defaultSelected === null && !options[_i2].disabled) {
              defaultSelected = options[_i2];
            }
          }
          if (defaultSelected !== null) {
            defaultSelected.selected = true;
          }
        }
      }
      function getHostProps$2(element, props) {
        return _assign({}, props, {value: undefined});
      }
      function initWrapperState$1(element, props) {
        var node = element;
        {
          checkSelectPropTypes(props);
        }
        var value = props.value;
        node._wrapperState = {
          initialValue: value != null ? value : props.defaultValue,
          wasMultiple: !!props.multiple
        };
        {
          if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValueDefaultValue$1) {
            warning(false, 'Select elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled select ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components');
            didWarnValueDefaultValue$1 = true;
          }
        }
      }
      function postMountWrapper$2(element, props) {
        var node = element;
        node.multiple = !!props.multiple;
        var value = props.value;
        if (value != null) {
          updateOptions(node, !!props.multiple, value, false);
        } else if (props.defaultValue != null) {
          updateOptions(node, !!props.multiple, props.defaultValue, true);
        }
      }
      function postUpdateWrapper(element, props) {
        var node = element;
        node._wrapperState.initialValue = undefined;
        var wasMultiple = node._wrapperState.wasMultiple;
        node._wrapperState.wasMultiple = !!props.multiple;
        var value = props.value;
        if (value != null) {
          updateOptions(node, !!props.multiple, value, false);
        } else if (wasMultiple !== !!props.multiple) {
          if (props.defaultValue != null) {
            updateOptions(node, !!props.multiple, props.defaultValue, true);
          } else {
            updateOptions(node, !!props.multiple, props.multiple ? [] : '', false);
          }
        }
      }
      function restoreControlledState$2(element, props) {
        var node = element;
        var value = props.value;
        if (value != null) {
          updateOptions(node, !!props.multiple, value, false);
        }
      }
      var getCurrentFiberStackAddendum$5 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;
      var didWarnValDefaultVal = false;
      function getHostProps$3(element, props) {
        var node = element;
        !(props.dangerouslySetInnerHTML == null) ? invariant(false, '`dangerouslySetInnerHTML` does not make sense on <textarea>.') : void 0;
        var hostProps = _assign({}, props, {
          value: undefined,
          defaultValue: undefined,
          children: '' + node._wrapperState.initialValue
        });
        return hostProps;
      }
      function initWrapperState$2(element, props) {
        var node = element;
        {
          ReactControlledValuePropTypes.checkPropTypes('textarea', props, getCurrentFiberStackAddendum$5);
          if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValDefaultVal) {
            warning(false, 'Textarea elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled textarea ' + 'and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components');
            didWarnValDefaultVal = true;
          }
        }
        var value = props.value;
        var initialValue = value;
        if (value == null) {
          var defaultValue = props.defaultValue;
          var children = props.children;
          if (children != null) {
            {
              warning(false, 'Use the `defaultValue` or `value` props instead of setting ' + 'children on <textarea>.');
            }
            !(defaultValue == null) ? invariant(false, 'If you supply `defaultValue` on a <textarea>, do not pass children.') : void 0;
            if (Array.isArray(children)) {
              !(children.length <= 1) ? invariant(false, '<textarea> can only have at most one child.') : void 0;
              children = children[0];
            }
            defaultValue = '' + children;
          }
          if (defaultValue == null) {
            defaultValue = '';
          }
          initialValue = defaultValue;
        }
        node._wrapperState = {initialValue: '' + initialValue};
      }
      function updateWrapper$1(element, props) {
        var node = element;
        var value = props.value;
        if (value != null) {
          var newValue = '' + value;
          if (newValue !== node.value) {
            node.value = newValue;
          }
          if (props.defaultValue == null) {
            node.defaultValue = newValue;
          }
        }
        if (props.defaultValue != null) {
          node.defaultValue = props.defaultValue;
        }
      }
      function postMountWrapper$3(element, props) {
        var node = element;
        var textContent = node.textContent;
        if (textContent === node._wrapperState.initialValue) {
          node.value = textContent;
        }
      }
      function restoreControlledState$3(element, props) {
        updateWrapper$1(element, props);
      }
      var HTML_NAMESPACE$1 = 'http://www.w3.org/1999/xhtml';
      var MATH_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
      var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
      var Namespaces = {
        html: HTML_NAMESPACE$1,
        mathml: MATH_NAMESPACE,
        svg: SVG_NAMESPACE
      };
      function getIntrinsicNamespace(type) {
        switch (type) {
          case 'svg':
            return SVG_NAMESPACE;
          case 'math':
            return MATH_NAMESPACE;
          default:
            return HTML_NAMESPACE$1;
        }
      }
      function getChildNamespace(parentNamespace, type) {
        if (parentNamespace == null || parentNamespace === HTML_NAMESPACE$1) {
          return getIntrinsicNamespace(type);
        }
        if (parentNamespace === SVG_NAMESPACE && type === 'foreignObject') {
          return HTML_NAMESPACE$1;
        }
        return parentNamespace;
      }
      var createMicrosoftUnsafeLocalFunction = function(func) {
        if (typeof MSApp !== 'undefined' && MSApp.execUnsafeLocalFunction) {
          return function(arg0, arg1, arg2, arg3) {
            MSApp.execUnsafeLocalFunction(function() {
              return func(arg0, arg1, arg2, arg3);
            });
          };
        } else {
          return func;
        }
      };
      var reusableSVGContainer = void 0;
      var setInnerHTML = createMicrosoftUnsafeLocalFunction(function(node, html) {
        if (node.namespaceURI === Namespaces.svg && !('innerHTML' in node)) {
          reusableSVGContainer = reusableSVGContainer || document.createElement('div');
          reusableSVGContainer.innerHTML = '<svg>' + html + '</svg>';
          var svgNode = reusableSVGContainer.firstChild;
          while (node.firstChild) {
            node.removeChild(node.firstChild);
          }
          while (svgNode.firstChild) {
            node.appendChild(svgNode.firstChild);
          }
        } else {
          node.innerHTML = html;
        }
      });
      var matchHtmlRegExp = /["'&<>]/;
      function escapeHtml(string) {
        var str = '' + string;
        var match = matchHtmlRegExp.exec(str);
        if (!match) {
          return str;
        }
        var escape;
        var html = '';
        var index = 0;
        var lastIndex = 0;
        for (index = match.index; index < str.length; index++) {
          switch (str.charCodeAt(index)) {
            case 34:
              escape = '&quot;';
              break;
            case 38:
              escape = '&amp;';
              break;
            case 39:
              escape = '&#x27;';
              break;
            case 60:
              escape = '&lt;';
              break;
            case 62:
              escape = '&gt;';
              break;
            default:
              continue;
          }
          if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
          }
          lastIndex = index + 1;
          html += escape;
        }
        return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
      }
      function escapeTextContentForBrowser(text) {
        if (typeof text === 'boolean' || typeof text === 'number') {
          return '' + text;
        }
        return escapeHtml(text);
      }
      var setTextContent = function(node, text) {
        if (text) {
          var firstChild = node.firstChild;
          if (firstChild && firstChild === node.lastChild && firstChild.nodeType === TEXT_NODE) {
            firstChild.nodeValue = text;
            return;
          }
        }
        node.textContent = text;
      };
      if (ExecutionEnvironment.canUseDOM) {
        if (!('textContent' in document.documentElement)) {
          setTextContent = function(node, text) {
            if (node.nodeType === TEXT_NODE) {
              node.nodeValue = text;
              return;
            }
            setInnerHTML(node, escapeTextContentForBrowser(text));
          };
        }
      }
      var setTextContent$1 = setTextContent;
      var isUnitlessNumber = {
        animationIterationCount: true,
        borderImageOutset: true,
        borderImageSlice: true,
        borderImageWidth: true,
        boxFlex: true,
        boxFlexGroup: true,
        boxOrdinalGroup: true,
        columnCount: true,
        columns: true,
        flex: true,
        flexGrow: true,
        flexPositive: true,
        flexShrink: true,
        flexNegative: true,
        flexOrder: true,
        gridRow: true,
        gridRowEnd: true,
        gridRowSpan: true,
        gridRowStart: true,
        gridColumn: true,
        gridColumnEnd: true,
        gridColumnSpan: true,
        gridColumnStart: true,
        fontWeight: true,
        lineClamp: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        tabSize: true,
        widows: true,
        zIndex: true,
        zoom: true,
        fillOpacity: true,
        floodOpacity: true,
        stopOpacity: true,
        strokeDasharray: true,
        strokeDashoffset: true,
        strokeMiterlimit: true,
        strokeOpacity: true,
        strokeWidth: true
      };
      function prefixKey(prefix, key) {
        return prefix + key.charAt(0).toUpperCase() + key.substring(1);
      }
      var prefixes = ['Webkit', 'ms', 'Moz', 'O'];
      Object.keys(isUnitlessNumber).forEach(function(prop) {
        prefixes.forEach(function(prefix) {
          isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
        });
      });
      function dangerousStyleValue(name, value, isCustomProperty) {
        var isEmpty = value == null || typeof value === 'boolean' || value === '';
        if (isEmpty) {
          return '';
        }
        if (!isCustomProperty && typeof value === 'number' && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) {
          return value + 'px';
        }
        return ('' + value).trim();
      }
      var warnValidStyle = emptyFunction$1;
      {
        var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
        var badStyleValueWithSemicolonPattern = /;\s*$/;
        var warnedStyleNames = {};
        var warnedStyleValues = {};
        var warnedForNaNValue = false;
        var warnedForInfinityValue = false;
        var warnHyphenatedStyleName = function(name, getStack) {
          if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
            return;
          }
          warnedStyleNames[name] = true;
          warning(false, 'Unsupported style property %s. Did you mean %s?%s', name, camelizeStyleName(name), getStack());
        };
        var warnBadVendoredStyleName = function(name, getStack) {
          if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
            return;
          }
          warnedStyleNames[name] = true;
          warning(false, 'Unsupported vendor-prefixed style property %s. Did you mean %s?%s', name, name.charAt(0).toUpperCase() + name.slice(1), getStack());
        };
        var warnStyleValueWithSemicolon = function(name, value, getStack) {
          if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
            return;
          }
          warnedStyleValues[value] = true;
          warning(false, "Style property values shouldn't contain a semicolon. " + 'Try "%s: %s" instead.%s', name, value.replace(badStyleValueWithSemicolonPattern, ''), getStack());
        };
        var warnStyleValueIsNaN = function(name, value, getStack) {
          if (warnedForNaNValue) {
            return;
          }
          warnedForNaNValue = true;
          warning(false, '`NaN` is an invalid value for the `%s` css style property.%s', name, getStack());
        };
        var warnStyleValueIsInfinity = function(name, value, getStack) {
          if (warnedForInfinityValue) {
            return;
          }
          warnedForInfinityValue = true;
          warning(false, '`Infinity` is an invalid value for the `%s` css style property.%s', name, getStack());
        };
        warnValidStyle = function(name, value, getStack) {
          if (name.indexOf('-') > -1) {
            warnHyphenatedStyleName(name, getStack);
          } else if (badVendoredStyleNamePattern.test(name)) {
            warnBadVendoredStyleName(name, getStack);
          } else if (badStyleValueWithSemicolonPattern.test(value)) {
            warnStyleValueWithSemicolon(name, value, getStack);
          }
          if (typeof value === 'number') {
            if (isNaN(value)) {
              warnStyleValueIsNaN(name, value, getStack);
            } else if (!isFinite(value)) {
              warnStyleValueIsInfinity(name, value, getStack);
            }
          }
        };
      }
      var warnValidStyle$1 = warnValidStyle;
      function createDangerousStringForStyles(styles) {
        {
          var serialized = '';
          var delimiter = '';
          for (var styleName in styles) {
            if (!styles.hasOwnProperty(styleName)) {
              continue;
            }
            var styleValue = styles[styleName];
            if (styleValue != null) {
              var isCustomProperty = styleName.indexOf('--') === 0;
              serialized += delimiter + hyphenateStyleName(styleName) + ':';
              serialized += dangerousStyleValue(styleName, styleValue, isCustomProperty);
              delimiter = ';';
            }
          }
          return serialized || null;
        }
      }
      function setValueForStyles(node, styles, getStack) {
        var style = node.style;
        for (var styleName in styles) {
          if (!styles.hasOwnProperty(styleName)) {
            continue;
          }
          var isCustomProperty = styleName.indexOf('--') === 0;
          {
            if (!isCustomProperty) {
              warnValidStyle$1(styleName, styles[styleName], getStack);
            }
          }
          var styleValue = dangerousStyleValue(styleName, styles[styleName], isCustomProperty);
          if (styleName === 'float') {
            styleName = 'cssFloat';
          }
          if (isCustomProperty) {
            style.setProperty(styleName, styleValue);
          } else {
            style[styleName] = styleValue;
          }
        }
      }
      var omittedCloseTags = {
        area: true,
        base: true,
        br: true,
        col: true,
        embed: true,
        hr: true,
        img: true,
        input: true,
        keygen: true,
        link: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true
      };
      var voidElementTags = _assign({menuitem: true}, omittedCloseTags);
      var HTML$1 = '__html';
      function assertValidProps(tag, props, getStack) {
        if (!props) {
          return;
        }
        if (voidElementTags[tag]) {
          !(props.children == null && props.dangerouslySetInnerHTML == null) ? invariant(false, '%s is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.%s', tag, getStack()) : void 0;
        }
        if (props.dangerouslySetInnerHTML != null) {
          !(props.children == null) ? invariant(false, 'Can only set one of `children` or `props.dangerouslySetInnerHTML`.') : void 0;
          !(typeof props.dangerouslySetInnerHTML === 'object' && HTML$1 in props.dangerouslySetInnerHTML) ? invariant(false, '`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information.') : void 0;
        }
        {
          warning(props.suppressContentEditableWarning || !props.contentEditable || props.children == null, 'A component is `contentEditable` and contains `children` managed by ' + 'React. It is now your responsibility to guarantee that none of ' + 'those nodes are unexpectedly modified or duplicated. This is ' + 'probably not intentional.%s', getStack());
        }
        !(props.style == null || typeof props.style === 'object') ? invariant(false, 'The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + \'em\'}} when using JSX.%s', getStack()) : void 0;
      }
      function isCustomComponent(tagName, props) {
        if (tagName.indexOf('-') === -1) {
          return typeof props.is === 'string';
        }
        switch (tagName) {
          case 'annotation-xml':
          case 'color-profile':
          case 'font-face':
          case 'font-face-src':
          case 'font-face-uri':
          case 'font-face-format':
          case 'font-face-name':
          case 'missing-glyph':
            return false;
          default:
            return true;
        }
      }
      var ariaProperties = {
        'aria-current': 0,
        'aria-details': 0,
        'aria-disabled': 0,
        'aria-hidden': 0,
        'aria-invalid': 0,
        'aria-keyshortcuts': 0,
        'aria-label': 0,
        'aria-roledescription': 0,
        'aria-autocomplete': 0,
        'aria-checked': 0,
        'aria-expanded': 0,
        'aria-haspopup': 0,
        'aria-level': 0,
        'aria-modal': 0,
        'aria-multiline': 0,
        'aria-multiselectable': 0,
        'aria-orientation': 0,
        'aria-placeholder': 0,
        'aria-pressed': 0,
        'aria-readonly': 0,
        'aria-required': 0,
        'aria-selected': 0,
        'aria-sort': 0,
        'aria-valuemax': 0,
        'aria-valuemin': 0,
        'aria-valuenow': 0,
        'aria-valuetext': 0,
        'aria-atomic': 0,
        'aria-busy': 0,
        'aria-live': 0,
        'aria-relevant': 0,
        'aria-dropeffect': 0,
        'aria-grabbed': 0,
        'aria-activedescendant': 0,
        'aria-colcount': 0,
        'aria-colindex': 0,
        'aria-colspan': 0,
        'aria-controls': 0,
        'aria-describedby': 0,
        'aria-errormessage': 0,
        'aria-flowto': 0,
        'aria-labelledby': 0,
        'aria-owns': 0,
        'aria-posinset': 0,
        'aria-rowcount': 0,
        'aria-rowindex': 0,
        'aria-rowspan': 0,
        'aria-setsize': 0
      };
      var warnedProperties = {};
      var rARIA = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
      var rARIACamel = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function getStackAddendum() {
        var stack = ReactDebugCurrentFrame.getStackAddendum();
        return stack != null ? stack : '';
      }
      function validateProperty(tagName, name) {
        if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
          return true;
        }
        if (rARIACamel.test(name)) {
          var ariaName = 'aria-' + name.slice(4).toLowerCase();
          var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
          if (correctName == null) {
            warning(false, 'Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.%s', name, getStackAddendum());
            warnedProperties[name] = true;
            return true;
          }
          if (name !== correctName) {
            warning(false, 'Invalid ARIA attribute `%s`. Did you mean `%s`?%s', name, correctName, getStackAddendum());
            warnedProperties[name] = true;
            return true;
          }
        }
        if (rARIA.test(name)) {
          var lowerCasedName = name.toLowerCase();
          var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
          if (standardName == null) {
            warnedProperties[name] = true;
            return false;
          }
          if (name !== standardName) {
            warning(false, 'Unknown ARIA attribute `%s`. Did you mean `%s`?%s', name, standardName, getStackAddendum());
            warnedProperties[name] = true;
            return true;
          }
        }
        return true;
      }
      function warnInvalidARIAProps(type, props) {
        var invalidProps = [];
        for (var key in props) {
          var isValid = validateProperty(type, key);
          if (!isValid) {
            invalidProps.push(key);
          }
        }
        var unknownPropString = invalidProps.map(function(prop) {
          return '`' + prop + '`';
        }).join(', ');
        if (invalidProps.length === 1) {
          warning(false, 'Invalid aria prop %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop%s', unknownPropString, type, getStackAddendum());
        } else if (invalidProps.length > 1) {
          warning(false, 'Invalid aria props %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop%s', unknownPropString, type, getStackAddendum());
        }
      }
      function validateProperties(type, props) {
        if (isCustomComponent(type, props)) {
          return;
        }
        warnInvalidARIAProps(type, props);
      }
      var didWarnValueNull = false;
      function getStackAddendum$1() {
        var stack = ReactDebugCurrentFrame.getStackAddendum();
        return stack != null ? stack : '';
      }
      function validateProperties$1(type, props) {
        if (type !== 'input' && type !== 'textarea' && type !== 'select') {
          return;
        }
        if (props != null && props.value === null && !didWarnValueNull) {
          didWarnValueNull = true;
          if (type === 'select' && props.multiple) {
            warning(false, '`value` prop on `%s` should not be null. ' + 'Consider using an empty array when `multiple` is set to `true` ' + 'to clear the component or `undefined` for uncontrolled components.%s', type, getStackAddendum$1());
          } else {
            warning(false, '`value` prop on `%s` should not be null. ' + 'Consider using an empty string to clear the component or `undefined` ' + 'for uncontrolled components.%s', type, getStackAddendum$1());
          }
        }
      }
      var possibleStandardNames = {
        accept: 'accept',
        acceptcharset: 'acceptCharset',
        'accept-charset': 'acceptCharset',
        accesskey: 'accessKey',
        action: 'action',
        allowfullscreen: 'allowFullScreen',
        alt: 'alt',
        as: 'as',
        async: 'async',
        autocapitalize: 'autoCapitalize',
        autocomplete: 'autoComplete',
        autocorrect: 'autoCorrect',
        autofocus: 'autoFocus',
        autoplay: 'autoPlay',
        autosave: 'autoSave',
        capture: 'capture',
        cellpadding: 'cellPadding',
        cellspacing: 'cellSpacing',
        challenge: 'challenge',
        charset: 'charSet',
        checked: 'checked',
        children: 'children',
        cite: 'cite',
        'class': 'className',
        classid: 'classID',
        classname: 'className',
        cols: 'cols',
        colspan: 'colSpan',
        content: 'content',
        contenteditable: 'contentEditable',
        contextmenu: 'contextMenu',
        controls: 'controls',
        controlslist: 'controlsList',
        coords: 'coords',
        crossorigin: 'crossOrigin',
        dangerouslysetinnerhtml: 'dangerouslySetInnerHTML',
        data: 'data',
        datetime: 'dateTime',
        'default': 'default',
        defaultchecked: 'defaultChecked',
        defaultvalue: 'defaultValue',
        defer: 'defer',
        dir: 'dir',
        disabled: 'disabled',
        download: 'download',
        draggable: 'draggable',
        enctype: 'encType',
        'for': 'htmlFor',
        form: 'form',
        formmethod: 'formMethod',
        formaction: 'formAction',
        formenctype: 'formEncType',
        formnovalidate: 'formNoValidate',
        formtarget: 'formTarget',
        frameborder: 'frameBorder',
        headers: 'headers',
        height: 'height',
        hidden: 'hidden',
        high: 'high',
        href: 'href',
        hreflang: 'hrefLang',
        htmlfor: 'htmlFor',
        httpequiv: 'httpEquiv',
        'http-equiv': 'httpEquiv',
        icon: 'icon',
        id: 'id',
        innerhtml: 'innerHTML',
        inputmode: 'inputMode',
        integrity: 'integrity',
        is: 'is',
        itemid: 'itemID',
        itemprop: 'itemProp',
        itemref: 'itemRef',
        itemscope: 'itemScope',
        itemtype: 'itemType',
        keyparams: 'keyParams',
        keytype: 'keyType',
        kind: 'kind',
        label: 'label',
        lang: 'lang',
        list: 'list',
        loop: 'loop',
        low: 'low',
        manifest: 'manifest',
        marginwidth: 'marginWidth',
        marginheight: 'marginHeight',
        max: 'max',
        maxlength: 'maxLength',
        media: 'media',
        mediagroup: 'mediaGroup',
        method: 'method',
        min: 'min',
        minlength: 'minLength',
        multiple: 'multiple',
        muted: 'muted',
        name: 'name',
        nonce: 'nonce',
        novalidate: 'noValidate',
        open: 'open',
        optimum: 'optimum',
        pattern: 'pattern',
        placeholder: 'placeholder',
        playsinline: 'playsInline',
        poster: 'poster',
        preload: 'preload',
        profile: 'profile',
        radiogroup: 'radioGroup',
        readonly: 'readOnly',
        referrerpolicy: 'referrerPolicy',
        rel: 'rel',
        required: 'required',
        reversed: 'reversed',
        role: 'role',
        rows: 'rows',
        rowspan: 'rowSpan',
        sandbox: 'sandbox',
        scope: 'scope',
        scoped: 'scoped',
        scrolling: 'scrolling',
        seamless: 'seamless',
        selected: 'selected',
        shape: 'shape',
        size: 'size',
        sizes: 'sizes',
        span: 'span',
        spellcheck: 'spellCheck',
        src: 'src',
        srcdoc: 'srcDoc',
        srclang: 'srcLang',
        srcset: 'srcSet',
        start: 'start',
        step: 'step',
        style: 'style',
        summary: 'summary',
        tabindex: 'tabIndex',
        target: 'target',
        title: 'title',
        type: 'type',
        usemap: 'useMap',
        value: 'value',
        width: 'width',
        wmode: 'wmode',
        wrap: 'wrap',
        about: 'about',
        accentheight: 'accentHeight',
        'accent-height': 'accentHeight',
        accumulate: 'accumulate',
        additive: 'additive',
        alignmentbaseline: 'alignmentBaseline',
        'alignment-baseline': 'alignmentBaseline',
        allowreorder: 'allowReorder',
        alphabetic: 'alphabetic',
        amplitude: 'amplitude',
        arabicform: 'arabicForm',
        'arabic-form': 'arabicForm',
        ascent: 'ascent',
        attributename: 'attributeName',
        attributetype: 'attributeType',
        autoreverse: 'autoReverse',
        azimuth: 'azimuth',
        basefrequency: 'baseFrequency',
        baselineshift: 'baselineShift',
        'baseline-shift': 'baselineShift',
        baseprofile: 'baseProfile',
        bbox: 'bbox',
        begin: 'begin',
        bias: 'bias',
        by: 'by',
        calcmode: 'calcMode',
        capheight: 'capHeight',
        'cap-height': 'capHeight',
        clip: 'clip',
        clippath: 'clipPath',
        'clip-path': 'clipPath',
        clippathunits: 'clipPathUnits',
        cliprule: 'clipRule',
        'clip-rule': 'clipRule',
        color: 'color',
        colorinterpolation: 'colorInterpolation',
        'color-interpolation': 'colorInterpolation',
        colorinterpolationfilters: 'colorInterpolationFilters',
        'color-interpolation-filters': 'colorInterpolationFilters',
        colorprofile: 'colorProfile',
        'color-profile': 'colorProfile',
        colorrendering: 'colorRendering',
        'color-rendering': 'colorRendering',
        contentscripttype: 'contentScriptType',
        contentstyletype: 'contentStyleType',
        cursor: 'cursor',
        cx: 'cx',
        cy: 'cy',
        d: 'd',
        datatype: 'datatype',
        decelerate: 'decelerate',
        descent: 'descent',
        diffuseconstant: 'diffuseConstant',
        direction: 'direction',
        display: 'display',
        divisor: 'divisor',
        dominantbaseline: 'dominantBaseline',
        'dominant-baseline': 'dominantBaseline',
        dur: 'dur',
        dx: 'dx',
        dy: 'dy',
        edgemode: 'edgeMode',
        elevation: 'elevation',
        enablebackground: 'enableBackground',
        'enable-background': 'enableBackground',
        end: 'end',
        exponent: 'exponent',
        externalresourcesrequired: 'externalResourcesRequired',
        fill: 'fill',
        fillopacity: 'fillOpacity',
        'fill-opacity': 'fillOpacity',
        fillrule: 'fillRule',
        'fill-rule': 'fillRule',
        filter: 'filter',
        filterres: 'filterRes',
        filterunits: 'filterUnits',
        floodopacity: 'floodOpacity',
        'flood-opacity': 'floodOpacity',
        floodcolor: 'floodColor',
        'flood-color': 'floodColor',
        focusable: 'focusable',
        fontfamily: 'fontFamily',
        'font-family': 'fontFamily',
        fontsize: 'fontSize',
        'font-size': 'fontSize',
        fontsizeadjust: 'fontSizeAdjust',
        'font-size-adjust': 'fontSizeAdjust',
        fontstretch: 'fontStretch',
        'font-stretch': 'fontStretch',
        fontstyle: 'fontStyle',
        'font-style': 'fontStyle',
        fontvariant: 'fontVariant',
        'font-variant': 'fontVariant',
        fontweight: 'fontWeight',
        'font-weight': 'fontWeight',
        format: 'format',
        from: 'from',
        fx: 'fx',
        fy: 'fy',
        g1: 'g1',
        g2: 'g2',
        glyphname: 'glyphName',
        'glyph-name': 'glyphName',
        glyphorientationhorizontal: 'glyphOrientationHorizontal',
        'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
        glyphorientationvertical: 'glyphOrientationVertical',
        'glyph-orientation-vertical': 'glyphOrientationVertical',
        glyphref: 'glyphRef',
        gradienttransform: 'gradientTransform',
        gradientunits: 'gradientUnits',
        hanging: 'hanging',
        horizadvx: 'horizAdvX',
        'horiz-adv-x': 'horizAdvX',
        horizoriginx: 'horizOriginX',
        'horiz-origin-x': 'horizOriginX',
        ideographic: 'ideographic',
        imagerendering: 'imageRendering',
        'image-rendering': 'imageRendering',
        in2: 'in2',
        'in': 'in',
        inlist: 'inlist',
        intercept: 'intercept',
        k1: 'k1',
        k2: 'k2',
        k3: 'k3',
        k4: 'k4',
        k: 'k',
        kernelmatrix: 'kernelMatrix',
        kernelunitlength: 'kernelUnitLength',
        kerning: 'kerning',
        keypoints: 'keyPoints',
        keysplines: 'keySplines',
        keytimes: 'keyTimes',
        lengthadjust: 'lengthAdjust',
        letterspacing: 'letterSpacing',
        'letter-spacing': 'letterSpacing',
        lightingcolor: 'lightingColor',
        'lighting-color': 'lightingColor',
        limitingconeangle: 'limitingConeAngle',
        local: 'local',
        markerend: 'markerEnd',
        'marker-end': 'markerEnd',
        markerheight: 'markerHeight',
        markermid: 'markerMid',
        'marker-mid': 'markerMid',
        markerstart: 'markerStart',
        'marker-start': 'markerStart',
        markerunits: 'markerUnits',
        markerwidth: 'markerWidth',
        mask: 'mask',
        maskcontentunits: 'maskContentUnits',
        maskunits: 'maskUnits',
        mathematical: 'mathematical',
        mode: 'mode',
        numoctaves: 'numOctaves',
        offset: 'offset',
        opacity: 'opacity',
        operator: 'operator',
        order: 'order',
        orient: 'orient',
        orientation: 'orientation',
        origin: 'origin',
        overflow: 'overflow',
        overlineposition: 'overlinePosition',
        'overline-position': 'overlinePosition',
        overlinethickness: 'overlineThickness',
        'overline-thickness': 'overlineThickness',
        paintorder: 'paintOrder',
        'paint-order': 'paintOrder',
        panose1: 'panose1',
        'panose-1': 'panose1',
        pathlength: 'pathLength',
        patterncontentunits: 'patternContentUnits',
        patterntransform: 'patternTransform',
        patternunits: 'patternUnits',
        pointerevents: 'pointerEvents',
        'pointer-events': 'pointerEvents',
        points: 'points',
        pointsatx: 'pointsAtX',
        pointsaty: 'pointsAtY',
        pointsatz: 'pointsAtZ',
        prefix: 'prefix',
        preservealpha: 'preserveAlpha',
        preserveaspectratio: 'preserveAspectRatio',
        primitiveunits: 'primitiveUnits',
        property: 'property',
        r: 'r',
        radius: 'radius',
        refx: 'refX',
        refy: 'refY',
        renderingintent: 'renderingIntent',
        'rendering-intent': 'renderingIntent',
        repeatcount: 'repeatCount',
        repeatdur: 'repeatDur',
        requiredextensions: 'requiredExtensions',
        requiredfeatures: 'requiredFeatures',
        resource: 'resource',
        restart: 'restart',
        result: 'result',
        results: 'results',
        rotate: 'rotate',
        rx: 'rx',
        ry: 'ry',
        scale: 'scale',
        security: 'security',
        seed: 'seed',
        shaperendering: 'shapeRendering',
        'shape-rendering': 'shapeRendering',
        slope: 'slope',
        spacing: 'spacing',
        specularconstant: 'specularConstant',
        specularexponent: 'specularExponent',
        speed: 'speed',
        spreadmethod: 'spreadMethod',
        startoffset: 'startOffset',
        stddeviation: 'stdDeviation',
        stemh: 'stemh',
        stemv: 'stemv',
        stitchtiles: 'stitchTiles',
        stopcolor: 'stopColor',
        'stop-color': 'stopColor',
        stopopacity: 'stopOpacity',
        'stop-opacity': 'stopOpacity',
        strikethroughposition: 'strikethroughPosition',
        'strikethrough-position': 'strikethroughPosition',
        strikethroughthickness: 'strikethroughThickness',
        'strikethrough-thickness': 'strikethroughThickness',
        string: 'string',
        stroke: 'stroke',
        strokedasharray: 'strokeDasharray',
        'stroke-dasharray': 'strokeDasharray',
        strokedashoffset: 'strokeDashoffset',
        'stroke-dashoffset': 'strokeDashoffset',
        strokelinecap: 'strokeLinecap',
        'stroke-linecap': 'strokeLinecap',
        strokelinejoin: 'strokeLinejoin',
        'stroke-linejoin': 'strokeLinejoin',
        strokemiterlimit: 'strokeMiterlimit',
        'stroke-miterlimit': 'strokeMiterlimit',
        strokewidth: 'strokeWidth',
        'stroke-width': 'strokeWidth',
        strokeopacity: 'strokeOpacity',
        'stroke-opacity': 'strokeOpacity',
        suppresscontenteditablewarning: 'suppressContentEditableWarning',
        suppresshydrationwarning: 'suppressHydrationWarning',
        surfacescale: 'surfaceScale',
        systemlanguage: 'systemLanguage',
        tablevalues: 'tableValues',
        targetx: 'targetX',
        targety: 'targetY',
        textanchor: 'textAnchor',
        'text-anchor': 'textAnchor',
        textdecoration: 'textDecoration',
        'text-decoration': 'textDecoration',
        textlength: 'textLength',
        textrendering: 'textRendering',
        'text-rendering': 'textRendering',
        to: 'to',
        transform: 'transform',
        'typeof': 'typeof',
        u1: 'u1',
        u2: 'u2',
        underlineposition: 'underlinePosition',
        'underline-position': 'underlinePosition',
        underlinethickness: 'underlineThickness',
        'underline-thickness': 'underlineThickness',
        unicode: 'unicode',
        unicodebidi: 'unicodeBidi',
        'unicode-bidi': 'unicodeBidi',
        unicoderange: 'unicodeRange',
        'unicode-range': 'unicodeRange',
        unitsperem: 'unitsPerEm',
        'units-per-em': 'unitsPerEm',
        unselectable: 'unselectable',
        valphabetic: 'vAlphabetic',
        'v-alphabetic': 'vAlphabetic',
        values: 'values',
        vectoreffect: 'vectorEffect',
        'vector-effect': 'vectorEffect',
        version: 'version',
        vertadvy: 'vertAdvY',
        'vert-adv-y': 'vertAdvY',
        vertoriginx: 'vertOriginX',
        'vert-origin-x': 'vertOriginX',
        vertoriginy: 'vertOriginY',
        'vert-origin-y': 'vertOriginY',
        vhanging: 'vHanging',
        'v-hanging': 'vHanging',
        videographic: 'vIdeographic',
        'v-ideographic': 'vIdeographic',
        viewbox: 'viewBox',
        viewtarget: 'viewTarget',
        visibility: 'visibility',
        vmathematical: 'vMathematical',
        'v-mathematical': 'vMathematical',
        vocab: 'vocab',
        widths: 'widths',
        wordspacing: 'wordSpacing',
        'word-spacing': 'wordSpacing',
        writingmode: 'writingMode',
        'writing-mode': 'writingMode',
        x1: 'x1',
        x2: 'x2',
        x: 'x',
        xchannelselector: 'xChannelSelector',
        xheight: 'xHeight',
        'x-height': 'xHeight',
        xlinkactuate: 'xlinkActuate',
        'xlink:actuate': 'xlinkActuate',
        xlinkarcrole: 'xlinkArcrole',
        'xlink:arcrole': 'xlinkArcrole',
        xlinkhref: 'xlinkHref',
        'xlink:href': 'xlinkHref',
        xlinkrole: 'xlinkRole',
        'xlink:role': 'xlinkRole',
        xlinkshow: 'xlinkShow',
        'xlink:show': 'xlinkShow',
        xlinktitle: 'xlinkTitle',
        'xlink:title': 'xlinkTitle',
        xlinktype: 'xlinkType',
        'xlink:type': 'xlinkType',
        xmlbase: 'xmlBase',
        'xml:base': 'xmlBase',
        xmllang: 'xmlLang',
        'xml:lang': 'xmlLang',
        xmlns: 'xmlns',
        'xml:space': 'xmlSpace',
        xmlnsxlink: 'xmlnsXlink',
        'xmlns:xlink': 'xmlnsXlink',
        xmlspace: 'xmlSpace',
        y1: 'y1',
        y2: 'y2',
        y: 'y',
        ychannelselector: 'yChannelSelector',
        z: 'z',
        zoomandpan: 'zoomAndPan'
      };
      function getStackAddendum$2() {
        var stack = ReactDebugCurrentFrame.getStackAddendum();
        return stack != null ? stack : '';
      }
      {
        var warnedProperties$1 = {};
        var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
        var EVENT_NAME_REGEX = /^on[A-Z]/;
        var rARIA$1 = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
        var rARIACamel$1 = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');
        var validateProperty$1 = function(tagName, name, value) {
          if (hasOwnProperty$1.call(warnedProperties$1, name) && warnedProperties$1[name]) {
            return true;
          }
          if (registrationNameModules.hasOwnProperty(name)) {
            return true;
          }
          if (plugins.length === 0 && EVENT_NAME_REGEX.test(name)) {
            return true;
          }
          var lowerCasedName = name.toLowerCase();
          var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
          if (registrationName != null) {
            warning(false, 'Invalid event handler property `%s`. Did you mean `%s`?%s', name, registrationName, getStackAddendum$2());
            warnedProperties$1[name] = true;
            return true;
          }
          if (lowerCasedName.indexOf('on') === 0 && lowerCasedName.length > 2) {
            warning(false, 'Unknown event handler property `%s`. It will be ignored.%s', name, getStackAddendum$2());
            warnedProperties$1[name] = true;
            return true;
          }
          if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
            return true;
          }
          if (lowerCasedName === 'onfocusin' || lowerCasedName === 'onfocusout') {
            warning(false, 'React uses onFocus and onBlur instead of onFocusIn and onFocusOut. ' + 'All React events are normalized to bubble, so onFocusIn and onFocusOut ' + 'are not needed/supported by React.');
            warnedProperties$1[name] = true;
            return true;
          }
          if (lowerCasedName === 'innerhtml') {
            warning(false, 'Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.');
            warnedProperties$1[name] = true;
            return true;
          }
          if (lowerCasedName === 'aria') {
            warning(false, 'The `aria` attribute is reserved for future use in React. ' + 'Pass individual `aria-` attributes instead.');
            warnedProperties$1[name] = true;
            return true;
          }
          if (lowerCasedName === 'is' && value !== null && value !== undefined && typeof value !== 'string') {
            warning(false, 'Received a `%s` for a string attribute `is`. If this is expected, cast ' + 'the value to a string.%s', typeof value, getStackAddendum$2());
            warnedProperties$1[name] = true;
            return true;
          }
          if (typeof value === 'number' && isNaN(value)) {
            warning(false, 'Received NaN for the `%s` attribute. If this is expected, cast ' + 'the value to a string.%s', name, getStackAddendum$2());
            warnedProperties$1[name] = true;
            return true;
          }
          var isReserved = isReservedProp(name);
          if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
            var standardName = possibleStandardNames[lowerCasedName];
            if (standardName !== name) {
              warning(false, 'Invalid DOM property `%s`. Did you mean `%s`?%s', name, standardName, getStackAddendum$2());
              warnedProperties$1[name] = true;
              return true;
            }
          } else if (!isReserved && name !== lowerCasedName) {
            warning(false, 'React does not recognize the `%s` prop on a DOM element. If you ' + 'intentionally want it to appear in the DOM as a custom ' + 'attribute, spell it as lowercase `%s` instead. ' + 'If you accidentally passed it from a parent component, remove ' + 'it from the DOM element.%s', name, lowerCasedName, getStackAddendum$2());
            warnedProperties$1[name] = true;
            return true;
          }
          if (typeof value === 'boolean' && !shouldAttributeAcceptBooleanValue(name)) {
            if (value) {
              warning(false, 'Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.%s', value, name, name, value, name, getStackAddendum$2());
            } else {
              warning(false, 'Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.\n\n' + 'If you used to conditionally omit it with %s={condition && value}, ' + 'pass %s={condition ? value : undefined} instead.%s', value, name, name, value, name, name, name, getStackAddendum$2());
            }
            warnedProperties$1[name] = true;
            return true;
          }
          if (isReserved) {
            return true;
          }
          if (!shouldSetAttribute(name, value)) {
            warnedProperties$1[name] = true;
            return false;
          }
          return true;
        };
      }
      var warnUnknownProperties = function(type, props) {
        var unknownProps = [];
        for (var key in props) {
          var isValid = validateProperty$1(type, key, props[key]);
          if (!isValid) {
            unknownProps.push(key);
          }
        }
        var unknownPropString = unknownProps.map(function(prop) {
          return '`' + prop + '`';
        }).join(', ');
        if (unknownProps.length === 1) {
          warning(false, 'Invalid value for prop %s on <%s> tag. Either remove it from the element, ' + 'or pass a string or number value to keep it in the DOM. ' + 'For details, see https://fb.me/react-attribute-behavior%s', unknownPropString, type, getStackAddendum$2());
        } else if (unknownProps.length > 1) {
          warning(false, 'Invalid values for props %s on <%s> tag. Either remove them from the element, ' + 'or pass a string or number value to keep them in the DOM. ' + 'For details, see https://fb.me/react-attribute-behavior%s', unknownPropString, type, getStackAddendum$2());
        }
      };
      function validateProperties$2(type, props) {
        if (isCustomComponent(type, props)) {
          return;
        }
        warnUnknownProperties(type, props);
      }
      var getCurrentFiberOwnerName$1 = ReactDebugCurrentFiber.getCurrentFiberOwnerName;
      var getCurrentFiberStackAddendum$2 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;
      var didWarnInvalidHydration = false;
      var didWarnShadyDOM = false;
      var DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
      var SUPPRESS_CONTENT_EDITABLE_WARNING = 'suppressContentEditableWarning';
      var SUPPRESS_HYDRATION_WARNING$1 = 'suppressHydrationWarning';
      var AUTOFOCUS = 'autoFocus';
      var CHILDREN = 'children';
      var STYLE = 'style';
      var HTML = '__html';
      var HTML_NAMESPACE = Namespaces.html;
      var getStack = emptyFunction$1.thatReturns('');
      {
        getStack = getCurrentFiberStackAddendum$2;
        var warnedUnknownTags = {
          time: true,
          dialog: true
        };
        var validatePropertiesInDevelopment = function(type, props) {
          validateProperties(type, props);
          validateProperties$1(type, props);
          validateProperties$2(type, props);
        };
        var NORMALIZE_NEWLINES_REGEX = /\r\n?/g;
        var NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
        var normalizeMarkupForTextOrAttribute = function(markup) {
          var markupString = typeof markup === 'string' ? markup : '' + markup;
          return markupString.replace(NORMALIZE_NEWLINES_REGEX, '\n').replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, '');
        };
        var warnForTextDifference = function(serverText, clientText) {
          if (didWarnInvalidHydration) {
            return;
          }
          var normalizedClientText = normalizeMarkupForTextOrAttribute(clientText);
          var normalizedServerText = normalizeMarkupForTextOrAttribute(serverText);
          if (normalizedServerText === normalizedClientText) {
            return;
          }
          didWarnInvalidHydration = true;
          warning(false, 'Text content did not match. Server: "%s" Client: "%s"', normalizedServerText, normalizedClientText);
        };
        var warnForPropDifference = function(propName, serverValue, clientValue) {
          if (didWarnInvalidHydration) {
            return;
          }
          var normalizedClientValue = normalizeMarkupForTextOrAttribute(clientValue);
          var normalizedServerValue = normalizeMarkupForTextOrAttribute(serverValue);
          if (normalizedServerValue === normalizedClientValue) {
            return;
          }
          didWarnInvalidHydration = true;
          warning(false, 'Prop `%s` did not match. Server: %s Client: %s', propName, JSON.stringify(normalizedServerValue), JSON.stringify(normalizedClientValue));
        };
        var warnForExtraAttributes = function(attributeNames) {
          if (didWarnInvalidHydration) {
            return;
          }
          didWarnInvalidHydration = true;
          var names = [];
          attributeNames.forEach(function(name) {
            names.push(name);
          });
          warning(false, 'Extra attributes from the server: %s', names);
        };
        var warnForInvalidEventListener = function(registrationName, listener) {
          if (listener === false) {
            warning(false, 'Expected `%s` listener to be a function, instead got `false`.\n\n' + 'If you used to conditionally omit it with %s={condition && value}, ' + 'pass %s={condition ? value : undefined} instead.%s', registrationName, registrationName, registrationName, getCurrentFiberStackAddendum$2());
          } else {
            warning(false, 'Expected `%s` listener to be a function, instead got a value of `%s` type.%s', registrationName, typeof listener, getCurrentFiberStackAddendum$2());
          }
        };
        var normalizeHTML = function(parent, html) {
          var testElement = parent.namespaceURI === HTML_NAMESPACE ? parent.ownerDocument.createElement(parent.tagName) : parent.ownerDocument.createElementNS(parent.namespaceURI, parent.tagName);
          testElement.innerHTML = html;
          return testElement.innerHTML;
        };
      }
      function ensureListeningTo(rootContainerElement, registrationName) {
        var isDocumentOrFragment = rootContainerElement.nodeType === DOCUMENT_NODE || rootContainerElement.nodeType === DOCUMENT_FRAGMENT_NODE;
        var doc = isDocumentOrFragment ? rootContainerElement : rootContainerElement.ownerDocument;
        listenTo(registrationName, doc);
      }
      function getOwnerDocumentFromRootContainer(rootContainerElement) {
        return rootContainerElement.nodeType === DOCUMENT_NODE ? rootContainerElement : rootContainerElement.ownerDocument;
      }
      var mediaEvents = {
        topAbort: 'abort',
        topCanPlay: 'canplay',
        topCanPlayThrough: 'canplaythrough',
        topDurationChange: 'durationchange',
        topEmptied: 'emptied',
        topEncrypted: 'encrypted',
        topEnded: 'ended',
        topError: 'error',
        topLoadedData: 'loadeddata',
        topLoadedMetadata: 'loadedmetadata',
        topLoadStart: 'loadstart',
        topPause: 'pause',
        topPlay: 'play',
        topPlaying: 'playing',
        topProgress: 'progress',
        topRateChange: 'ratechange',
        topSeeked: 'seeked',
        topSeeking: 'seeking',
        topStalled: 'stalled',
        topSuspend: 'suspend',
        topTimeUpdate: 'timeupdate',
        topVolumeChange: 'volumechange',
        topWaiting: 'waiting'
      };
      function trapClickOnNonInteractiveElement(node) {
        node.onclick = emptyFunction$1;
      }
      function setInitialDOMProperties(tag, domElement, rootContainerElement, nextProps, isCustomComponentTag) {
        for (var propKey in nextProps) {
          if (!nextProps.hasOwnProperty(propKey)) {
            continue;
          }
          var nextProp = nextProps[propKey];
          if (propKey === STYLE) {
            {
              if (nextProp) {
                Object.freeze(nextProp);
              }
            }
            setValueForStyles(domElement, nextProp, getStack);
          } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
            var nextHtml = nextProp ? nextProp[HTML] : undefined;
            if (nextHtml != null) {
              setInnerHTML(domElement, nextHtml);
            }
          } else if (propKey === CHILDREN) {
            if (typeof nextProp === 'string') {
              var canSetTextContent = tag !== 'textarea' || nextProp !== '';
              if (canSetTextContent) {
                setTextContent$1(domElement, nextProp);
              }
            } else if (typeof nextProp === 'number') {
              setTextContent$1(domElement, '' + nextProp);
            }
          } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1) {} else if (propKey === AUTOFOCUS) {} else if (registrationNameModules.hasOwnProperty(propKey)) {
            if (nextProp != null) {
              if (true && typeof nextProp !== 'function') {
                warnForInvalidEventListener(propKey, nextProp);
              }
              ensureListeningTo(rootContainerElement, propKey);
            }
          } else if (isCustomComponentTag) {
            setValueForAttribute(domElement, propKey, nextProp);
          } else if (nextProp != null) {
            setValueForProperty(domElement, propKey, nextProp);
          }
        }
      }
      function updateDOMProperties(domElement, updatePayload, wasCustomComponentTag, isCustomComponentTag) {
        for (var i = 0; i < updatePayload.length; i += 2) {
          var propKey = updatePayload[i];
          var propValue = updatePayload[i + 1];
          if (propKey === STYLE) {
            setValueForStyles(domElement, propValue, getStack);
          } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
            setInnerHTML(domElement, propValue);
          } else if (propKey === CHILDREN) {
            setTextContent$1(domElement, propValue);
          } else if (isCustomComponentTag) {
            if (propValue != null) {
              setValueForAttribute(domElement, propKey, propValue);
            } else {
              deleteValueForAttribute(domElement, propKey);
            }
          } else if (propValue != null) {
            setValueForProperty(domElement, propKey, propValue);
          } else {
            deleteValueForProperty(domElement, propKey);
          }
        }
      }
      function createElement$1(type, props, rootContainerElement, parentNamespace) {
        var ownerDocument = getOwnerDocumentFromRootContainer(rootContainerElement);
        var domElement;
        var namespaceURI = parentNamespace;
        if (namespaceURI === HTML_NAMESPACE) {
          namespaceURI = getIntrinsicNamespace(type);
        }
        if (namespaceURI === HTML_NAMESPACE) {
          {
            var isCustomComponentTag = isCustomComponent(type, props);
            warning(isCustomComponentTag || type === type.toLowerCase(), '<%s /> is using uppercase HTML. Always use lowercase HTML tags ' + 'in React.', type);
          }
          if (type === 'script') {
            var div = ownerDocument.createElement('div');
            div.innerHTML = '<script><' + '/script>';
            var firstChild = div.firstChild;
            domElement = div.removeChild(firstChild);
          } else if (typeof props.is === 'string') {
            domElement = ownerDocument.createElement(type, {is: props.is});
          } else {
            domElement = ownerDocument.createElement(type);
          }
        } else {
          domElement = ownerDocument.createElementNS(namespaceURI, type);
        }
        {
          if (namespaceURI === HTML_NAMESPACE) {
            if (!isCustomComponentTag && Object.prototype.toString.call(domElement) === '[object HTMLUnknownElement]' && !Object.prototype.hasOwnProperty.call(warnedUnknownTags, type)) {
              warnedUnknownTags[type] = true;
              warning(false, 'The tag <%s> is unrecognized in this browser. ' + 'If you meant to render a React component, start its name with ' + 'an uppercase letter.', type);
            }
          }
        }
        return domElement;
      }
      function createTextNode$1(text, rootContainerElement) {
        return getOwnerDocumentFromRootContainer(rootContainerElement).createTextNode(text);
      }
      function setInitialProperties$1(domElement, tag, rawProps, rootContainerElement) {
        var isCustomComponentTag = isCustomComponent(tag, rawProps);
        {
          validatePropertiesInDevelopment(tag, rawProps);
          if (isCustomComponentTag && !didWarnShadyDOM && domElement.shadyRoot) {
            warning(false, '%s is using shady DOM. Using shady DOM with React can ' + 'cause things to break subtly.', getCurrentFiberOwnerName$1() || 'A component');
            didWarnShadyDOM = true;
          }
        }
        var props;
        switch (tag) {
          case 'iframe':
          case 'object':
            trapBubbledEvent('topLoad', 'load', domElement);
            props = rawProps;
            break;
          case 'video':
          case 'audio':
            for (var event in mediaEvents) {
              if (mediaEvents.hasOwnProperty(event)) {
                trapBubbledEvent(event, mediaEvents[event], domElement);
              }
            }
            props = rawProps;
            break;
          case 'source':
            trapBubbledEvent('topError', 'error', domElement);
            props = rawProps;
            break;
          case 'img':
          case 'image':
            trapBubbledEvent('topError', 'error', domElement);
            trapBubbledEvent('topLoad', 'load', domElement);
            props = rawProps;
            break;
          case 'form':
            trapBubbledEvent('topReset', 'reset', domElement);
            trapBubbledEvent('topSubmit', 'submit', domElement);
            props = rawProps;
            break;
          case 'details':
            trapBubbledEvent('topToggle', 'toggle', domElement);
            props = rawProps;
            break;
          case 'input':
            initWrapperState(domElement, rawProps);
            props = getHostProps(domElement, rawProps);
            trapBubbledEvent('topInvalid', 'invalid', domElement);
            ensureListeningTo(rootContainerElement, 'onChange');
            break;
          case 'option':
            validateProps(domElement, rawProps);
            props = getHostProps$1(domElement, rawProps);
            break;
          case 'select':
            initWrapperState$1(domElement, rawProps);
            props = getHostProps$2(domElement, rawProps);
            trapBubbledEvent('topInvalid', 'invalid', domElement);
            ensureListeningTo(rootContainerElement, 'onChange');
            break;
          case 'textarea':
            initWrapperState$2(domElement, rawProps);
            props = getHostProps$3(domElement, rawProps);
            trapBubbledEvent('topInvalid', 'invalid', domElement);
            ensureListeningTo(rootContainerElement, 'onChange');
            break;
          default:
            props = rawProps;
        }
        assertValidProps(tag, props, getStack);
        setInitialDOMProperties(tag, domElement, rootContainerElement, props, isCustomComponentTag);
        switch (tag) {
          case 'input':
            track(domElement);
            postMountWrapper(domElement, rawProps);
            break;
          case 'textarea':
            track(domElement);
            postMountWrapper$3(domElement, rawProps);
            break;
          case 'option':
            postMountWrapper$1(domElement, rawProps);
            break;
          case 'select':
            postMountWrapper$2(domElement, rawProps);
            break;
          default:
            if (typeof props.onClick === 'function') {
              trapClickOnNonInteractiveElement(domElement);
            }
            break;
        }
      }
      function diffProperties$1(domElement, tag, lastRawProps, nextRawProps, rootContainerElement) {
        {
          validatePropertiesInDevelopment(tag, nextRawProps);
        }
        var updatePayload = null;
        var lastProps;
        var nextProps;
        switch (tag) {
          case 'input':
            lastProps = getHostProps(domElement, lastRawProps);
            nextProps = getHostProps(domElement, nextRawProps);
            updatePayload = [];
            break;
          case 'option':
            lastProps = getHostProps$1(domElement, lastRawProps);
            nextProps = getHostProps$1(domElement, nextRawProps);
            updatePayload = [];
            break;
          case 'select':
            lastProps = getHostProps$2(domElement, lastRawProps);
            nextProps = getHostProps$2(domElement, nextRawProps);
            updatePayload = [];
            break;
          case 'textarea':
            lastProps = getHostProps$3(domElement, lastRawProps);
            nextProps = getHostProps$3(domElement, nextRawProps);
            updatePayload = [];
            break;
          default:
            lastProps = lastRawProps;
            nextProps = nextRawProps;
            if (typeof lastProps.onClick !== 'function' && typeof nextProps.onClick === 'function') {
              trapClickOnNonInteractiveElement(domElement);
            }
            break;
        }
        assertValidProps(tag, nextProps, getStack);
        var propKey;
        var styleName;
        var styleUpdates = null;
        for (propKey in lastProps) {
          if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
            continue;
          }
          if (propKey === STYLE) {
            var lastStyle = lastProps[propKey];
            for (styleName in lastStyle) {
              if (lastStyle.hasOwnProperty(styleName)) {
                if (!styleUpdates) {
                  styleUpdates = {};
                }
                styleUpdates[styleName] = '';
              }
            }
          } else if (propKey === DANGEROUSLY_SET_INNER_HTML || propKey === CHILDREN) {} else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1) {} else if (propKey === AUTOFOCUS) {} else if (registrationNameModules.hasOwnProperty(propKey)) {
            if (!updatePayload) {
              updatePayload = [];
            }
          } else {
            (updatePayload = updatePayload || []).push(propKey, null);
          }
        }
        for (propKey in nextProps) {
          var nextProp = nextProps[propKey];
          var lastProp = lastProps != null ? lastProps[propKey] : undefined;
          if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || nextProp == null && lastProp == null) {
            continue;
          }
          if (propKey === STYLE) {
            {
              if (nextProp) {
                Object.freeze(nextProp);
              }
            }
            if (lastProp) {
              for (styleName in lastProp) {
                if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
                  if (!styleUpdates) {
                    styleUpdates = {};
                  }
                  styleUpdates[styleName] = '';
                }
              }
              for (styleName in nextProp) {
                if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
                  if (!styleUpdates) {
                    styleUpdates = {};
                  }
                  styleUpdates[styleName] = nextProp[styleName];
                }
              }
            } else {
              if (!styleUpdates) {
                if (!updatePayload) {
                  updatePayload = [];
                }
                updatePayload.push(propKey, styleUpdates);
              }
              styleUpdates = nextProp;
            }
          } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
            var nextHtml = nextProp ? nextProp[HTML] : undefined;
            var lastHtml = lastProp ? lastProp[HTML] : undefined;
            if (nextHtml != null) {
              if (lastHtml !== nextHtml) {
                (updatePayload = updatePayload || []).push(propKey, '' + nextHtml);
              }
            } else {}
          } else if (propKey === CHILDREN) {
            if (lastProp !== nextProp && (typeof nextProp === 'string' || typeof nextProp === 'number')) {
              (updatePayload = updatePayload || []).push(propKey, '' + nextProp);
            }
          } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1) {} else if (registrationNameModules.hasOwnProperty(propKey)) {
            if (nextProp != null) {
              if (true && typeof nextProp !== 'function') {
                warnForInvalidEventListener(propKey, nextProp);
              }
              ensureListeningTo(rootContainerElement, propKey);
            }
            if (!updatePayload && lastProp !== nextProp) {
              updatePayload = [];
            }
          } else {
            (updatePayload = updatePayload || []).push(propKey, nextProp);
          }
        }
        if (styleUpdates) {
          (updatePayload = updatePayload || []).push(STYLE, styleUpdates);
        }
        return updatePayload;
      }
      function updateProperties$1(domElement, updatePayload, tag, lastRawProps, nextRawProps) {
        var wasCustomComponentTag = isCustomComponent(tag, lastRawProps);
        var isCustomComponentTag = isCustomComponent(tag, nextRawProps);
        updateDOMProperties(domElement, updatePayload, wasCustomComponentTag, isCustomComponentTag);
        switch (tag) {
          case 'input':
            updateWrapper(domElement, nextRawProps);
            updateValueIfChanged(domElement);
            break;
          case 'textarea':
            updateWrapper$1(domElement, nextRawProps);
            break;
          case 'select':
            postUpdateWrapper(domElement, nextRawProps);
            break;
        }
      }
      function diffHydratedProperties$1(domElement, tag, rawProps, parentNamespace, rootContainerElement) {
        {
          var suppressHydrationWarning = rawProps[SUPPRESS_HYDRATION_WARNING$1] === true;
          var isCustomComponentTag = isCustomComponent(tag, rawProps);
          validatePropertiesInDevelopment(tag, rawProps);
          if (isCustomComponentTag && !didWarnShadyDOM && domElement.shadyRoot) {
            warning(false, '%s is using shady DOM. Using shady DOM with React can ' + 'cause things to break subtly.', getCurrentFiberOwnerName$1() || 'A component');
            didWarnShadyDOM = true;
          }
        }
        switch (tag) {
          case 'iframe':
          case 'object':
            trapBubbledEvent('topLoad', 'load', domElement);
            break;
          case 'video':
          case 'audio':
            for (var event in mediaEvents) {
              if (mediaEvents.hasOwnProperty(event)) {
                trapBubbledEvent(event, mediaEvents[event], domElement);
              }
            }
            break;
          case 'source':
            trapBubbledEvent('topError', 'error', domElement);
            break;
          case 'img':
          case 'image':
            trapBubbledEvent('topError', 'error', domElement);
            trapBubbledEvent('topLoad', 'load', domElement);
            break;
          case 'form':
            trapBubbledEvent('topReset', 'reset', domElement);
            trapBubbledEvent('topSubmit', 'submit', domElement);
            break;
          case 'details':
            trapBubbledEvent('topToggle', 'toggle', domElement);
            break;
          case 'input':
            initWrapperState(domElement, rawProps);
            trapBubbledEvent('topInvalid', 'invalid', domElement);
            ensureListeningTo(rootContainerElement, 'onChange');
            break;
          case 'option':
            validateProps(domElement, rawProps);
            break;
          case 'select':
            initWrapperState$1(domElement, rawProps);
            trapBubbledEvent('topInvalid', 'invalid', domElement);
            ensureListeningTo(rootContainerElement, 'onChange');
            break;
          case 'textarea':
            initWrapperState$2(domElement, rawProps);
            trapBubbledEvent('topInvalid', 'invalid', domElement);
            ensureListeningTo(rootContainerElement, 'onChange');
            break;
        }
        assertValidProps(tag, rawProps, getStack);
        {
          var extraAttributeNames = new Set();
          var attributes = domElement.attributes;
          for (var i = 0; i < attributes.length; i++) {
            var name = attributes[i].name.toLowerCase();
            switch (name) {
              case 'data-reactroot':
                break;
              case 'value':
                break;
              case 'checked':
                break;
              case 'selected':
                break;
              default:
                extraAttributeNames.add(attributes[i].name);
            }
          }
        }
        var updatePayload = null;
        for (var propKey in rawProps) {
          if (!rawProps.hasOwnProperty(propKey)) {
            continue;
          }
          var nextProp = rawProps[propKey];
          if (propKey === CHILDREN) {
            if (typeof nextProp === 'string') {
              if (domElement.textContent !== nextProp) {
                if (true && !suppressHydrationWarning) {
                  warnForTextDifference(domElement.textContent, nextProp);
                }
                updatePayload = [CHILDREN, nextProp];
              }
            } else if (typeof nextProp === 'number') {
              if (domElement.textContent !== '' + nextProp) {
                if (true && !suppressHydrationWarning) {
                  warnForTextDifference(domElement.textContent, nextProp);
                }
                updatePayload = [CHILDREN, '' + nextProp];
              }
            }
          } else if (registrationNameModules.hasOwnProperty(propKey)) {
            if (nextProp != null) {
              if (true && typeof nextProp !== 'function') {
                warnForInvalidEventListener(propKey, nextProp);
              }
              ensureListeningTo(rootContainerElement, propKey);
            }
          } else {
            var serverValue;
            var propertyInfo;
            if (suppressHydrationWarning) {} else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1 || propKey === 'value' || propKey === 'checked' || propKey === 'selected') {} else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
              var rawHtml = nextProp ? nextProp[HTML] || '' : '';
              var serverHTML = domElement.innerHTML;
              var expectedHTML = normalizeHTML(domElement, rawHtml);
              if (expectedHTML !== serverHTML) {
                warnForPropDifference(propKey, serverHTML, expectedHTML);
              }
            } else if (propKey === STYLE) {
              extraAttributeNames['delete'](propKey);
              var expectedStyle = createDangerousStringForStyles(nextProp);
              serverValue = domElement.getAttribute('style');
              if (expectedStyle !== serverValue) {
                warnForPropDifference(propKey, serverValue, expectedStyle);
              }
            } else if (isCustomComponentTag) {
              extraAttributeNames['delete'](propKey.toLowerCase());
              serverValue = getValueForAttribute(domElement, propKey, nextProp);
              if (nextProp !== serverValue) {
                warnForPropDifference(propKey, serverValue, nextProp);
              }
            } else if (shouldSetAttribute(propKey, nextProp)) {
              if (propertyInfo = getPropertyInfo(propKey)) {
                extraAttributeNames['delete'](propertyInfo.attributeName);
                serverValue = getValueForProperty(domElement, propKey, nextProp);
              } else {
                var ownNamespace = parentNamespace;
                if (ownNamespace === HTML_NAMESPACE) {
                  ownNamespace = getIntrinsicNamespace(tag);
                }
                if (ownNamespace === HTML_NAMESPACE) {
                  extraAttributeNames['delete'](propKey.toLowerCase());
                } else {
                  extraAttributeNames['delete'](propKey);
                }
                serverValue = getValueForAttribute(domElement, propKey, nextProp);
              }
              if (nextProp !== serverValue) {
                warnForPropDifference(propKey, serverValue, nextProp);
              }
            }
          }
        }
        {
          if (extraAttributeNames.size > 0 && !suppressHydrationWarning) {
            warnForExtraAttributes(extraAttributeNames);
          }
        }
        switch (tag) {
          case 'input':
            track(domElement);
            postMountWrapper(domElement, rawProps);
            break;
          case 'textarea':
            track(domElement);
            postMountWrapper$3(domElement, rawProps);
            break;
          case 'select':
          case 'option':
            break;
          default:
            if (typeof rawProps.onClick === 'function') {
              trapClickOnNonInteractiveElement(domElement);
            }
            break;
        }
        return updatePayload;
      }
      function diffHydratedText$1(textNode, text) {
        var isDifferent = textNode.nodeValue !== text;
        return isDifferent;
      }
      function warnForUnmatchedText$1(textNode, text) {
        {
          warnForTextDifference(textNode.nodeValue, text);
        }
      }
      function warnForDeletedHydratableElement$1(parentNode, child) {
        {
          if (didWarnInvalidHydration) {
            return;
          }
          didWarnInvalidHydration = true;
          warning(false, 'Did not expect server HTML to contain a <%s> in <%s>.', child.nodeName.toLowerCase(), parentNode.nodeName.toLowerCase());
        }
      }
      function warnForDeletedHydratableText$1(parentNode, child) {
        {
          if (didWarnInvalidHydration) {
            return;
          }
          didWarnInvalidHydration = true;
          warning(false, 'Did not expect server HTML to contain the text node "%s" in <%s>.', child.nodeValue, parentNode.nodeName.toLowerCase());
        }
      }
      function warnForInsertedHydratedElement$1(parentNode, tag, props) {
        {
          if (didWarnInvalidHydration) {
            return;
          }
          didWarnInvalidHydration = true;
          warning(false, 'Expected server HTML to contain a matching <%s> in <%s>.', tag, parentNode.nodeName.toLowerCase());
        }
      }
      function warnForInsertedHydratedText$1(parentNode, text) {
        {
          if (text === '') {
            return;
          }
          if (didWarnInvalidHydration) {
            return;
          }
          didWarnInvalidHydration = true;
          warning(false, 'Expected server HTML to contain a matching text node for "%s" in <%s>.', text, parentNode.nodeName.toLowerCase());
        }
      }
      function restoreControlledState(domElement, tag, props) {
        switch (tag) {
          case 'input':
            restoreControlledState$1(domElement, props);
            return;
          case 'textarea':
            restoreControlledState$3(domElement, props);
            return;
          case 'select':
            restoreControlledState$2(domElement, props);
            return;
        }
      }
      var ReactDOMFiberComponent = Object.freeze({
        createElement: createElement$1,
        createTextNode: createTextNode$1,
        setInitialProperties: setInitialProperties$1,
        diffProperties: diffProperties$1,
        updateProperties: updateProperties$1,
        diffHydratedProperties: diffHydratedProperties$1,
        diffHydratedText: diffHydratedText$1,
        warnForUnmatchedText: warnForUnmatchedText$1,
        warnForDeletedHydratableElement: warnForDeletedHydratableElement$1,
        warnForDeletedHydratableText: warnForDeletedHydratableText$1,
        warnForInsertedHydratedElement: warnForInsertedHydratedElement$1,
        warnForInsertedHydratedText: warnForInsertedHydratedText$1,
        restoreControlledState: restoreControlledState
      });
      var getCurrentFiberStackAddendum$6 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;
      var validateDOMNesting = emptyFunction$1;
      {
        var specialTags = ['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsound', 'blockquote', 'body', 'br', 'button', 'caption', 'center', 'col', 'colgroup', 'dd', 'details', 'dir', 'div', 'dl', 'dt', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'iframe', 'img', 'input', 'isindex', 'li', 'link', 'listing', 'main', 'marquee', 'menu', 'menuitem', 'meta', 'nav', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'p', 'param', 'plaintext', 'pre', 'script', 'section', 'select', 'source', 'style', 'summary', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'track', 'ul', 'wbr', 'xmp'];
        var inScopeTags = ['applet', 'caption', 'html', 'table', 'td', 'th', 'marquee', 'object', 'template', 'foreignObject', 'desc', 'title'];
        var buttonScopeTags = inScopeTags.concat(['button']);
        var impliedEndTags = ['dd', 'dt', 'li', 'option', 'optgroup', 'p', 'rp', 'rt'];
        var emptyAncestorInfo = {
          current: null,
          formTag: null,
          aTagInScope: null,
          buttonTagInScope: null,
          nobrTagInScope: null,
          pTagInButtonScope: null,
          listItemTagAutoclosing: null,
          dlItemTagAutoclosing: null
        };
        var updatedAncestorInfo$1 = function(oldInfo, tag, instance) {
          var ancestorInfo = _assign({}, oldInfo || emptyAncestorInfo);
          var info = {
            tag: tag,
            instance: instance
          };
          if (inScopeTags.indexOf(tag) !== -1) {
            ancestorInfo.aTagInScope = null;
            ancestorInfo.buttonTagInScope = null;
            ancestorInfo.nobrTagInScope = null;
          }
          if (buttonScopeTags.indexOf(tag) !== -1) {
            ancestorInfo.pTagInButtonScope = null;
          }
          if (specialTags.indexOf(tag) !== -1 && tag !== 'address' && tag !== 'div' && tag !== 'p') {
            ancestorInfo.listItemTagAutoclosing = null;
            ancestorInfo.dlItemTagAutoclosing = null;
          }
          ancestorInfo.current = info;
          if (tag === 'form') {
            ancestorInfo.formTag = info;
          }
          if (tag === 'a') {
            ancestorInfo.aTagInScope = info;
          }
          if (tag === 'button') {
            ancestorInfo.buttonTagInScope = info;
          }
          if (tag === 'nobr') {
            ancestorInfo.nobrTagInScope = info;
          }
          if (tag === 'p') {
            ancestorInfo.pTagInButtonScope = info;
          }
          if (tag === 'li') {
            ancestorInfo.listItemTagAutoclosing = info;
          }
          if (tag === 'dd' || tag === 'dt') {
            ancestorInfo.dlItemTagAutoclosing = info;
          }
          return ancestorInfo;
        };
        var isTagValidWithParent = function(tag, parentTag) {
          switch (parentTag) {
            case 'select':
              return tag === 'option' || tag === 'optgroup' || tag === '#text';
            case 'optgroup':
              return tag === 'option' || tag === '#text';
            case 'option':
              return tag === '#text';
            case 'tr':
              return tag === 'th' || tag === 'td' || tag === 'style' || tag === 'script' || tag === 'template';
            case 'tbody':
            case 'thead':
            case 'tfoot':
              return tag === 'tr' || tag === 'style' || tag === 'script' || tag === 'template';
            case 'colgroup':
              return tag === 'col' || tag === 'template';
            case 'table':
              return tag === 'caption' || tag === 'colgroup' || tag === 'tbody' || tag === 'tfoot' || tag === 'thead' || tag === 'style' || tag === 'script' || tag === 'template';
            case 'head':
              return tag === 'base' || tag === 'basefont' || tag === 'bgsound' || tag === 'link' || tag === 'meta' || tag === 'title' || tag === 'noscript' || tag === 'noframes' || tag === 'style' || tag === 'script' || tag === 'template';
            case 'html':
              return tag === 'head' || tag === 'body';
            case '#document':
              return tag === 'html';
          }
          switch (tag) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
              return parentTag !== 'h1' && parentTag !== 'h2' && parentTag !== 'h3' && parentTag !== 'h4' && parentTag !== 'h5' && parentTag !== 'h6';
            case 'rp':
            case 'rt':
              return impliedEndTags.indexOf(parentTag) === -1;
            case 'body':
            case 'caption':
            case 'col':
            case 'colgroup':
            case 'frame':
            case 'head':
            case 'html':
            case 'tbody':
            case 'td':
            case 'tfoot':
            case 'th':
            case 'thead':
            case 'tr':
              return parentTag == null;
          }
          return true;
        };
        var findInvalidAncestorForTag = function(tag, ancestorInfo) {
          switch (tag) {
            case 'address':
            case 'article':
            case 'aside':
            case 'blockquote':
            case 'center':
            case 'details':
            case 'dialog':
            case 'dir':
            case 'div':
            case 'dl':
            case 'fieldset':
            case 'figcaption':
            case 'figure':
            case 'footer':
            case 'header':
            case 'hgroup':
            case 'main':
            case 'menu':
            case 'nav':
            case 'ol':
            case 'p':
            case 'section':
            case 'summary':
            case 'ul':
            case 'pre':
            case 'listing':
            case 'table':
            case 'hr':
            case 'xmp':
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
              return ancestorInfo.pTagInButtonScope;
            case 'form':
              return ancestorInfo.formTag || ancestorInfo.pTagInButtonScope;
            case 'li':
              return ancestorInfo.listItemTagAutoclosing;
            case 'dd':
            case 'dt':
              return ancestorInfo.dlItemTagAutoclosing;
            case 'button':
              return ancestorInfo.buttonTagInScope;
            case 'a':
              return ancestorInfo.aTagInScope;
            case 'nobr':
              return ancestorInfo.nobrTagInScope;
          }
          return null;
        };
        var didWarn = {};
        validateDOMNesting = function(childTag, childText, ancestorInfo) {
          ancestorInfo = ancestorInfo || emptyAncestorInfo;
          var parentInfo = ancestorInfo.current;
          var parentTag = parentInfo && parentInfo.tag;
          if (childText != null) {
            warning(childTag == null, 'validateDOMNesting: when childText is passed, childTag should be null');
            childTag = '#text';
          }
          var invalidParent = isTagValidWithParent(childTag, parentTag) ? null : parentInfo;
          var invalidAncestor = invalidParent ? null : findInvalidAncestorForTag(childTag, ancestorInfo);
          var invalidParentOrAncestor = invalidParent || invalidAncestor;
          if (!invalidParentOrAncestor) {
            return;
          }
          var ancestorTag = invalidParentOrAncestor.tag;
          var addendum = getCurrentFiberStackAddendum$6();
          var warnKey = !!invalidParent + '|' + childTag + '|' + ancestorTag + '|' + addendum;
          if (didWarn[warnKey]) {
            return;
          }
          didWarn[warnKey] = true;
          var tagDisplayName = childTag;
          var whitespaceInfo = '';
          if (childTag === '#text') {
            if (/\S/.test(childText)) {
              tagDisplayName = 'Text nodes';
            } else {
              tagDisplayName = 'Whitespace text nodes';
              whitespaceInfo = " Make sure you don't have any extra whitespace between tags on " + 'each line of your source code.';
            }
          } else {
            tagDisplayName = '<' + childTag + '>';
          }
          if (invalidParent) {
            var info = '';
            if (ancestorTag === 'table' && childTag === 'tr') {
              info += ' Add a <tbody> to your code to match the DOM tree generated by ' + 'the browser.';
            }
            warning(false, 'validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s%s', tagDisplayName, ancestorTag, whitespaceInfo, info, addendum);
          } else {
            warning(false, 'validateDOMNesting(...): %s cannot appear as a descendant of ' + '<%s>.%s', tagDisplayName, ancestorTag, addendum);
          }
        };
        validateDOMNesting.updatedAncestorInfo = updatedAncestorInfo$1;
        validateDOMNesting.isTagValidInContext = function(tag, ancestorInfo) {
          ancestorInfo = ancestorInfo || emptyAncestorInfo;
          var parentInfo = ancestorInfo.current;
          var parentTag = parentInfo && parentInfo.tag;
          return isTagValidWithParent(tag, parentTag) && !findInvalidAncestorForTag(tag, ancestorInfo);
        };
      }
      var validateDOMNesting$1 = validateDOMNesting;
      var createElement = createElement$1;
      var createTextNode = createTextNode$1;
      var setInitialProperties = setInitialProperties$1;
      var diffProperties = diffProperties$1;
      var updateProperties = updateProperties$1;
      var diffHydratedProperties = diffHydratedProperties$1;
      var diffHydratedText = diffHydratedText$1;
      var warnForUnmatchedText = warnForUnmatchedText$1;
      var warnForDeletedHydratableElement = warnForDeletedHydratableElement$1;
      var warnForDeletedHydratableText = warnForDeletedHydratableText$1;
      var warnForInsertedHydratedElement = warnForInsertedHydratedElement$1;
      var warnForInsertedHydratedText = warnForInsertedHydratedText$1;
      var updatedAncestorInfo = validateDOMNesting$1.updatedAncestorInfo;
      var precacheFiberNode = precacheFiberNode$1;
      var updateFiberProps = updateFiberProps$1;
      {
        var SUPPRESS_HYDRATION_WARNING = 'suppressHydrationWarning';
        if (typeof Map !== 'function' || Map.prototype == null || typeof Map.prototype.forEach !== 'function' || typeof Set !== 'function' || Set.prototype == null || typeof Set.prototype.clear !== 'function' || typeof Set.prototype.forEach !== 'function') {
          warning(false, 'React depends on Map and Set built-in types. Make sure that you load a ' + 'polyfill in older browsers. http://fb.me/react-polyfills');
        }
      }
      injection$3.injectFiberControlledHostComponent(ReactDOMFiberComponent);
      var eventsEnabled = null;
      var selectionInformation = null;
      function isValidContainer(node) {
        return !!(node && (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || node.nodeType === COMMENT_NODE && node.nodeValue === ' react-mount-point-unstable '));
      }
      function getReactRootElementInContainer(container) {
        if (!container) {
          return null;
        }
        if (container.nodeType === DOCUMENT_NODE) {
          return container.documentElement;
        } else {
          return container.firstChild;
        }
      }
      function shouldHydrateDueToLegacyHeuristic(container) {
        var rootElement = getReactRootElementInContainer(container);
        return !!(rootElement && rootElement.nodeType === ELEMENT_NODE && rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME));
      }
      function shouldAutoFocusHostComponent(type, props) {
        switch (type) {
          case 'button':
          case 'input':
          case 'select':
          case 'textarea':
            return !!props.autoFocus;
        }
        return false;
      }
      var DOMRenderer = reactReconciler({
        getRootHostContext: function(rootContainerInstance) {
          var type = void 0;
          var namespace = void 0;
          var nodeType = rootContainerInstance.nodeType;
          switch (nodeType) {
            case DOCUMENT_NODE:
            case DOCUMENT_FRAGMENT_NODE:
              {
                type = nodeType === DOCUMENT_NODE ? '#document' : '#fragment';
                var root = rootContainerInstance.documentElement;
                namespace = root ? root.namespaceURI : getChildNamespace(null, '');
                break;
              }
            default:
              {
                var container = nodeType === COMMENT_NODE ? rootContainerInstance.parentNode : rootContainerInstance;
                var ownNamespace = container.namespaceURI || null;
                type = container.tagName;
                namespace = getChildNamespace(ownNamespace, type);
                break;
              }
          }
          {
            var validatedTag = type.toLowerCase();
            var _ancestorInfo = updatedAncestorInfo(null, validatedTag, null);
            return {
              namespace: namespace,
              ancestorInfo: _ancestorInfo
            };
          }
          return namespace;
        },
        getChildHostContext: function(parentHostContext, type) {
          {
            var parentHostContextDev = parentHostContext;
            var _namespace = getChildNamespace(parentHostContextDev.namespace, type);
            var _ancestorInfo2 = updatedAncestorInfo(parentHostContextDev.ancestorInfo, type, null);
            return {
              namespace: _namespace,
              ancestorInfo: _ancestorInfo2
            };
          }
          var parentNamespace = parentHostContext;
          return getChildNamespace(parentNamespace, type);
        },
        getPublicInstance: function(instance) {
          return instance;
        },
        prepareForCommit: function() {
          eventsEnabled = isEnabled();
          selectionInformation = getSelectionInformation();
          setEnabled(false);
        },
        resetAfterCommit: function() {
          restoreSelection(selectionInformation);
          selectionInformation = null;
          setEnabled(eventsEnabled);
          eventsEnabled = null;
        },
        createInstance: function(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
          var parentNamespace = void 0;
          {
            var hostContextDev = hostContext;
            validateDOMNesting$1(type, null, hostContextDev.ancestorInfo);
            if (typeof props.children === 'string' || typeof props.children === 'number') {
              var string = '' + props.children;
              var ownAncestorInfo = updatedAncestorInfo(hostContextDev.ancestorInfo, type, null);
              validateDOMNesting$1(null, string, ownAncestorInfo);
            }
            parentNamespace = hostContextDev.namespace;
          }
          var domElement = createElement(type, props, rootContainerInstance, parentNamespace);
          precacheFiberNode(internalInstanceHandle, domElement);
          updateFiberProps(domElement, props);
          return domElement;
        },
        appendInitialChild: function(parentInstance, child) {
          parentInstance.appendChild(child);
        },
        finalizeInitialChildren: function(domElement, type, props, rootContainerInstance) {
          setInitialProperties(domElement, type, props, rootContainerInstance);
          return shouldAutoFocusHostComponent(type, props);
        },
        prepareUpdate: function(domElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
          {
            var hostContextDev = hostContext;
            if (typeof newProps.children !== typeof oldProps.children && (typeof newProps.children === 'string' || typeof newProps.children === 'number')) {
              var string = '' + newProps.children;
              var ownAncestorInfo = updatedAncestorInfo(hostContextDev.ancestorInfo, type, null);
              validateDOMNesting$1(null, string, ownAncestorInfo);
            }
          }
          return diffProperties(domElement, type, oldProps, newProps, rootContainerInstance);
        },
        shouldSetTextContent: function(type, props) {
          return type === 'textarea' || typeof props.children === 'string' || typeof props.children === 'number' || typeof props.dangerouslySetInnerHTML === 'object' && props.dangerouslySetInnerHTML !== null && typeof props.dangerouslySetInnerHTML.__html === 'string';
        },
        shouldDeprioritizeSubtree: function(type, props) {
          return !!props.hidden;
        },
        createTextInstance: function(text, rootContainerInstance, hostContext, internalInstanceHandle) {
          {
            var hostContextDev = hostContext;
            validateDOMNesting$1(null, text, hostContextDev.ancestorInfo);
          }
          var textNode = createTextNode(text, rootContainerInstance);
          precacheFiberNode(internalInstanceHandle, textNode);
          return textNode;
        },
        now: now,
        mutation: {
          commitMount: function(domElement, type, newProps, internalInstanceHandle) {
            domElement.focus();
          },
          commitUpdate: function(domElement, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
            updateFiberProps(domElement, newProps);
            updateProperties(domElement, updatePayload, type, oldProps, newProps);
          },
          resetTextContent: function(domElement) {
            domElement.textContent = '';
          },
          commitTextUpdate: function(textInstance, oldText, newText) {
            textInstance.nodeValue = newText;
          },
          appendChild: function(parentInstance, child) {
            parentInstance.appendChild(child);
          },
          appendChildToContainer: function(container, child) {
            if (container.nodeType === COMMENT_NODE) {
              container.parentNode.insertBefore(child, container);
            } else {
              container.appendChild(child);
            }
          },
          insertBefore: function(parentInstance, child, beforeChild) {
            parentInstance.insertBefore(child, beforeChild);
          },
          insertInContainerBefore: function(container, child, beforeChild) {
            if (container.nodeType === COMMENT_NODE) {
              container.parentNode.insertBefore(child, beforeChild);
            } else {
              container.insertBefore(child, beforeChild);
            }
          },
          removeChild: function(parentInstance, child) {
            parentInstance.removeChild(child);
          },
          removeChildFromContainer: function(container, child) {
            if (container.nodeType === COMMENT_NODE) {
              container.parentNode.removeChild(child);
            } else {
              container.removeChild(child);
            }
          }
        },
        hydration: {
          canHydrateInstance: function(instance, type, props) {
            return instance.nodeType === ELEMENT_NODE && type.toLowerCase() === instance.nodeName.toLowerCase();
          },
          canHydrateTextInstance: function(instance, text) {
            if (text === '') {
              return false;
            }
            return instance.nodeType === TEXT_NODE;
          },
          getNextHydratableSibling: function(instance) {
            var node = instance.nextSibling;
            while (node && node.nodeType !== ELEMENT_NODE && node.nodeType !== TEXT_NODE) {
              node = node.nextSibling;
            }
            return node;
          },
          getFirstHydratableChild: function(parentInstance) {
            var next = parentInstance.firstChild;
            while (next && next.nodeType !== ELEMENT_NODE && next.nodeType !== TEXT_NODE) {
              next = next.nextSibling;
            }
            return next;
          },
          hydrateInstance: function(instance, type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
            precacheFiberNode(internalInstanceHandle, instance);
            updateFiberProps(instance, props);
            var parentNamespace = void 0;
            {
              var hostContextDev = hostContext;
              parentNamespace = hostContextDev.namespace;
            }
            return diffHydratedProperties(instance, type, props, parentNamespace, rootContainerInstance);
          },
          hydrateTextInstance: function(textInstance, text, internalInstanceHandle) {
            precacheFiberNode(internalInstanceHandle, textInstance);
            return diffHydratedText(textInstance, text);
          },
          didNotMatchHydratedContainerTextInstance: function(parentContainer, textInstance, text) {
            {
              warnForUnmatchedText(textInstance, text);
            }
          },
          didNotMatchHydratedTextInstance: function(parentType, parentProps, parentInstance, textInstance, text) {
            if (true && parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
              warnForUnmatchedText(textInstance, text);
            }
          },
          didNotHydrateContainerInstance: function(parentContainer, instance) {
            {
              if (instance.nodeType === 1) {
                warnForDeletedHydratableElement(parentContainer, instance);
              } else {
                warnForDeletedHydratableText(parentContainer, instance);
              }
            }
          },
          didNotHydrateInstance: function(parentType, parentProps, parentInstance, instance) {
            if (true && parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
              if (instance.nodeType === 1) {
                warnForDeletedHydratableElement(parentInstance, instance);
              } else {
                warnForDeletedHydratableText(parentInstance, instance);
              }
            }
          },
          didNotFindHydratableContainerInstance: function(parentContainer, type, props) {
            {
              warnForInsertedHydratedElement(parentContainer, type, props);
            }
          },
          didNotFindHydratableContainerTextInstance: function(parentContainer, text) {
            {
              warnForInsertedHydratedText(parentContainer, text);
            }
          },
          didNotFindHydratableInstance: function(parentType, parentProps, parentInstance, type, props) {
            if (true && parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
              warnForInsertedHydratedElement(parentInstance, type, props);
            }
          },
          didNotFindHydratableTextInstance: function(parentType, parentProps, parentInstance, text) {
            if (true && parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
              warnForInsertedHydratedText(parentInstance, text);
            }
          }
        },
        scheduleDeferredCallback: rIC,
        useSyncScheduling: !enableAsyncSchedulingByDefaultInReactDOM
      });
      injection$4.injectFiberBatchedUpdates(DOMRenderer.batchedUpdates);
      var warnedAboutHydrateAPI = false;
      function renderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
        !isValidContainer(container) ? invariant(false, 'Target container is not a DOM element.') : void 0;
        {
          if (container._reactRootContainer && container.nodeType !== COMMENT_NODE) {
            var hostInstance = DOMRenderer.findHostInstanceWithNoPortals(container._reactRootContainer.current);
            if (hostInstance) {
              warning(hostInstance.parentNode === container, 'render(...): It looks like the React-rendered content of this ' + 'container was removed without using React. This is not ' + 'supported and will cause errors. Instead, call ' + 'ReactDOM.unmountComponentAtNode to empty a container.');
            }
          }
          var isRootRenderedBySomeReact = !!container._reactRootContainer;
          var rootEl = getReactRootElementInContainer(container);
          var hasNonRootReactChild = !!(rootEl && getInstanceFromNode$1(rootEl));
          warning(!hasNonRootReactChild || isRootRenderedBySomeReact, 'render(...): Replacing React-rendered children with a new root ' + 'component. If you intended to update the children of this node, ' + 'you should instead have the existing children update their state ' + 'and render the new components instead of calling ReactDOM.render.');
          warning(container.nodeType !== ELEMENT_NODE || !container.tagName || container.tagName.toUpperCase() !== 'BODY', 'render(): Rendering components directly into document.body is ' + 'discouraged, since its children are often manipulated by third-party ' + 'scripts and browser extensions. This may lead to subtle ' + 'reconciliation issues. Try rendering into a container element created ' + 'for your app.');
        }
        var root = container._reactRootContainer;
        if (!root) {
          var shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
          if (!shouldHydrate) {
            var warned = false;
            var rootSibling = void 0;
            while (rootSibling = container.lastChild) {
              {
                if (!warned && rootSibling.nodeType === ELEMENT_NODE && rootSibling.hasAttribute(ROOT_ATTRIBUTE_NAME)) {
                  warned = true;
                  warning(false, 'render(): Target node has markup rendered by React, but there ' + 'are unrelated nodes as well. This is most commonly caused by ' + 'white-space inserted around server-rendered markup.');
                }
              }
              container.removeChild(rootSibling);
            }
          }
          {
            if (shouldHydrate && !forceHydrate && !warnedAboutHydrateAPI) {
              warnedAboutHydrateAPI = true;
              lowPriorityWarning$1(false, 'render(): Calling ReactDOM.render() to hydrate server-rendered markup ' + 'will stop working in React v17. Replace the ReactDOM.render() call ' + 'with ReactDOM.hydrate() if you want React to attach to the server HTML.');
            }
          }
          var newRoot = DOMRenderer.createContainer(container, shouldHydrate);
          root = container._reactRootContainer = newRoot;
          DOMRenderer.unbatchedUpdates(function() {
            DOMRenderer.updateContainer(children, newRoot, parentComponent, callback);
          });
        } else {
          DOMRenderer.updateContainer(children, root, parentComponent, callback);
        }
        return DOMRenderer.getPublicRootInstance(root);
      }
      function createPortal(children, container) {
        var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        !isValidContainer(container) ? invariant(false, 'Target container is not a DOM element.') : void 0;
        return createPortal$1(children, container, null, key);
      }
      function ReactRoot(container, hydrate) {
        var root = DOMRenderer.createContainer(container, hydrate);
        this._reactRootContainer = root;
      }
      ReactRoot.prototype.render = function(children, callback) {
        var root = this._reactRootContainer;
        DOMRenderer.updateContainer(children, root, null, callback);
      };
      ReactRoot.prototype.unmount = function(callback) {
        var root = this._reactRootContainer;
        DOMRenderer.updateContainer(null, root, null, callback);
      };
      var ReactDOM = {
        createPortal: createPortal,
        findDOMNode: function(componentOrElement) {
          {
            var owner = ReactCurrentOwner.current;
            if (owner !== null) {
              var warnedAboutRefsInRender = owner.stateNode._warnedAboutRefsInRender;
              warning(warnedAboutRefsInRender, '%s is accessing findDOMNode inside its render(). ' + 'render() should be a pure function of props and state. It should ' + 'never access something that requires stale data from the previous ' + 'render, such as refs. Move this logic to componentDidMount and ' + 'componentDidUpdate instead.', getComponentName(owner) || 'A component');
              owner.stateNode._warnedAboutRefsInRender = true;
            }
          }
          if (componentOrElement == null) {
            return null;
          }
          if (componentOrElement.nodeType === ELEMENT_NODE) {
            return componentOrElement;
          }
          var inst = get(componentOrElement);
          if (inst) {
            return DOMRenderer.findHostInstance(inst);
          }
          if (typeof componentOrElement.render === 'function') {
            invariant(false, 'Unable to find node on an unmounted component.');
          } else {
            invariant(false, 'Element appears to be neither ReactComponent nor DOMNode. Keys: %s', Object.keys(componentOrElement));
          }
        },
        hydrate: function(element, container, callback) {
          return renderSubtreeIntoContainer(null, element, container, true, callback);
        },
        render: function(element, container, callback) {
          return renderSubtreeIntoContainer(null, element, container, false, callback);
        },
        unstable_renderSubtreeIntoContainer: function(parentComponent, element, containerNode, callback) {
          !(parentComponent != null && has(parentComponent)) ? invariant(false, 'parentComponent must be a valid React Component') : void 0;
          return renderSubtreeIntoContainer(parentComponent, element, containerNode, false, callback);
        },
        unmountComponentAtNode: function(container) {
          !isValidContainer(container) ? invariant(false, 'unmountComponentAtNode(...): Target container is not a DOM element.') : void 0;
          if (container._reactRootContainer) {
            {
              var rootEl = getReactRootElementInContainer(container);
              var renderedByDifferentReact = rootEl && !getInstanceFromNode$1(rootEl);
              warning(!renderedByDifferentReact, "unmountComponentAtNode(): The node you're attempting to unmount " + 'was rendered by another copy of React.');
            }
            DOMRenderer.unbatchedUpdates(function() {
              renderSubtreeIntoContainer(null, null, container, false, function() {
                container._reactRootContainer = null;
              });
            });
            return true;
          } else {
            {
              var _rootEl = getReactRootElementInContainer(container);
              var hasNonRootReactChild = !!(_rootEl && getInstanceFromNode$1(_rootEl));
              var isContainerReactRoot = container.nodeType === 1 && isValidContainer(container.parentNode) && !!container.parentNode._reactRootContainer;
              warning(!hasNonRootReactChild, "unmountComponentAtNode(): The node you're attempting to unmount " + 'was rendered by React and is not a top-level container. %s', isContainerReactRoot ? 'You may have accidentally passed in a React root node instead ' + 'of its container.' : 'Instead, have the parent component update its state and ' + 'rerender in order to remove this component.');
            }
            return false;
          }
        },
        unstable_createPortal: createPortal,
        unstable_batchedUpdates: batchedUpdates,
        unstable_deferredUpdates: DOMRenderer.deferredUpdates,
        flushSync: DOMRenderer.flushSync,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
          EventPluginHub: EventPluginHub,
          EventPluginRegistry: EventPluginRegistry,
          EventPropagators: EventPropagators,
          ReactControlledComponent: ReactControlledComponent,
          ReactDOMComponentTree: ReactDOMComponentTree,
          ReactDOMEventListener: ReactDOMEventListener
        }
      };
      if (enableCreateRoot) {
        ReactDOM.createRoot = function createRoot(container, options) {
          var hydrate = options != null && options.hydrate === true;
          return new ReactRoot(container, hydrate);
        };
      }
      var foundDevTools = DOMRenderer.injectIntoDevTools({
        findFiberByHostInstance: getClosestInstanceFromNode,
        bundleType: 1,
        version: ReactVersion,
        rendererPackageName: 'react-dom'
      });
      {
        if (!foundDevTools && ExecutionEnvironment.canUseDOM && window.top === window.self) {
          if (navigator.userAgent.indexOf('Chrome') > -1 && navigator.userAgent.indexOf('Edge') === -1 || navigator.userAgent.indexOf('Firefox') > -1) {
            var protocol = window.location.protocol;
            if (/^(https?|file):$/.test(protocol)) {
              console.info('%cDownload the React DevTools ' + 'for a better development experience: ' + 'https://fb.me/react-devtools' + (protocol === 'file:' ? '\nYou might need to use a local HTTP server (instead of file://): ' + 'https://fb.me/react-devtools-faq' : ''), 'font-weight:bold');
            }
          }
        }
      }
      var ReactDOM$2 = Object.freeze({default: ReactDOM});
      var ReactDOM$3 = (ReactDOM$2 && ReactDOM) || ReactDOM$2;
      var reactDom = ReactDOM$3['default'] ? ReactDOM$3['default'] : ReactDOM$3;
      module.exports = reactDom;
    })();
  }
})(require('process'));
