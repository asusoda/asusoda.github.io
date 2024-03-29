(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _assign = require('object-assign');

var emptyObject = require('fbjs/lib/emptyObject');
var _invariant = require('fbjs/lib/invariant');

if (process.env.NODE_ENV !== 'production') {
  var warning = require('fbjs/lib/warning');
}

var MIXINS_KEY = 'mixins';

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}

var ReactPropTypeLocationNames;
if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
} else {
  ReactPropTypeLocationNames = {};
}

function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
  /**
   * Policies that describe methods in `ReactClassInterface`.
   */

  var injectedMixins = [];

  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */
  var ReactClassInterface = {
    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: 'DEFINE_MANY',

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: 'DEFINE_MANY',

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: 'DEFINE_MANY',

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: 'DEFINE_MANY',

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: 'DEFINE_MANY',

    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: 'DEFINE_MANY_MERGED',

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: 'DEFINE_MANY_MERGED',

    /**
     * @return {object}
     * @optional
     */
    getChildContext: 'DEFINE_MANY_MERGED',

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @required
     */
    render: 'DEFINE_ONCE',

    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: 'DEFINE_MANY',

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: 'DEFINE_MANY',

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: 'DEFINE_ONCE',

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: 'DEFINE_MANY',

    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: 'OVERRIDE_BASE'
  };

  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */
  var RESERVED_SPEC_KEYS = {
    displayName: function(Constructor, displayName) {
      Constructor.displayName = displayName;
    },
    mixins: function(Constructor, mixins) {
      if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
          mixSpecIntoComponent(Constructor, mixins[i]);
        }
      }
    },
    childContextTypes: function(Constructor, childContextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, childContextTypes, 'childContext');
      }
      Constructor.childContextTypes = _assign(
        {},
        Constructor.childContextTypes,
        childContextTypes
      );
    },
    contextTypes: function(Constructor, contextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, contextTypes, 'context');
      }
      Constructor.contextTypes = _assign(
        {},
        Constructor.contextTypes,
        contextTypes
      );
    },
    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function(Constructor, getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(
          Constructor.getDefaultProps,
          getDefaultProps
        );
      } else {
        Constructor.getDefaultProps = getDefaultProps;
      }
    },
    propTypes: function(Constructor, propTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, propTypes, 'prop');
      }
      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
    },
    statics: function(Constructor, statics) {
      mixStaticSpecIntoComponent(Constructor, statics);
    },
    autobind: function() {}
  };

  function validateTypeDef(Constructor, typeDef, location) {
    for (var propName in typeDef) {
      if (typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an _invariant so components
        // don't show up in prod but only in __DEV__
        if (process.env.NODE_ENV !== 'production') {
          warning(
            typeof typeDef[propName] === 'function',
            '%s: %s type `%s` is invalid; it must be a function, usually from ' +
              'React.PropTypes.',
            Constructor.displayName || 'ReactClass',
            ReactPropTypeLocationNames[location],
            propName
          );
        }
      }
    }
  }

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name)
      ? ReactClassInterface[name]
      : null;

    // Disallow overriding of base class methods unless explicitly allowed.
    if (ReactClassMixin.hasOwnProperty(name)) {
      _invariant(
        specPolicy === 'OVERRIDE_BASE',
        'ReactClassInterface: You are attempting to override ' +
          '`%s` from your class specification. Ensure that your method names ' +
          'do not overlap with React methods.',
        name
      );
    }

    // Disallow defining methods more than once unless explicitly allowed.
    if (isAlreadyDefined) {
      _invariant(
        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
        'ReactClassInterface: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be due ' +
          'to a mixin.',
        name
      );
    }
  }

  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */
  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      if (process.env.NODE_ENV !== 'production') {
        var typeofSpec = typeof spec;
        var isMixinValid = typeofSpec === 'object' && spec !== null;

        if (process.env.NODE_ENV !== 'production') {
          warning(
            isMixinValid,
            "%s: You're attempting to include a mixin that is either null " +
              'or not an object. Check the mixins included by the component, ' +
              'as well as any mixins they include themselves. ' +
              'Expected object but got %s.',
            Constructor.displayName || 'ReactClass',
            spec === null ? null : typeofSpec
          );
        }
      }

      return;
    }

    _invariant(
      typeof spec !== 'function',
      "ReactClass: You're attempting to " +
        'use a component class or function as a mixin. Instead, just use a ' +
        'regular object.'
    );
    _invariant(
      !isValidElement(spec),
      "ReactClass: You're attempting to " +
        'use a component as a mixin. Instead, just use a regular object.'
    );

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs;

    // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.
    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind =
          isFunction &&
          !isReactClassMethod &&
          !isAlreadyDefined &&
          spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name];

            // These cases should already be caught by validateMethodOverride.
            _invariant(
              isReactClassMethod &&
                (specPolicy === 'DEFINE_MANY_MERGED' ||
                  specPolicy === 'DEFINE_MANY'),
              'ReactClass: Unexpected spec policy %s for key %s ' +
                'when mixing in component specs.',
              specPolicy,
              name
            );

            // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.
            if (specPolicy === 'DEFINE_MANY_MERGED') {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === 'DEFINE_MANY') {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;
            if (process.env.NODE_ENV !== 'production') {
              // Add verbose displayName to the function, which helps when looking
              // at profiling tools.
              if (typeof property === 'function' && spec.displayName) {
                proto[name].displayName = spec.displayName + '_' + name;
              }
            }
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }
    for (var name in statics) {
      var property = statics[name];
      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;
      _invariant(
        !isReserved,
        'ReactClass: You are attempting to define a reserved ' +
          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
          'as an instance property instead; it will still be accessible on the ' +
          'constructor.',
        name
      );

      var isInherited = name in Constructor;
      _invariant(
        !isInherited,
        'ReactClass: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be ' +
          'due to a mixin.',
        name
      );
      Constructor[name] = property;
    }
  }

  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */
  function mergeIntoWithNoDuplicateKeys(one, two) {
    _invariant(
      one && two && typeof one === 'object' && typeof two === 'object',
      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
    );

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        _invariant(
          one[key] === undefined,
          'mergeIntoWithNoDuplicateKeys(): ' +
            'Tried to merge two objects with the same key: `%s`. This conflict ' +
            'may be due to a mixin; in particular, this may be caused by two ' +
            'getInitialState() or getDefaultProps() methods returning objects ' +
            'with clashing keys.',
          key
        );
        one[key] = two[key];
      }
    }
    return one;
  }

  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);
      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }
      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }

  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }

  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */
  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);
    if (process.env.NODE_ENV !== 'production') {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function(newThis) {
        for (
          var _len = arguments.length,
            args = Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          args[_key - 1] = arguments[_key];
        }

        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): React component methods may only be bound to the ' +
                'component instance. See %s',
              componentName
            );
          }
        } else if (!args.length) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): You are binding a component method to the component. ' +
                'React does this for you automatically in a high-performance ' +
                'way, so you can safely remove this call. See %s',
              componentName
            );
          }
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }

  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */
  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;
    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  var IsMountedPreMixin = {
    componentDidMount: function() {
      this.__isMounted = true;
    }
  };

  var IsMountedPostMixin = {
    componentWillUnmount: function() {
      this.__isMounted = false;
    }
  };

  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */
  var ReactClassMixin = {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function(newState, callback) {
      this.updater.enqueueReplaceState(this, newState, callback);
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function() {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          this.__didWarnIsMounted,
          '%s: isMounted is deprecated. Instead, make sure to clean up ' +
            'subscriptions and pending requests in componentWillUnmount to ' +
            'prevent memory leaks.',
          (this.constructor && this.constructor.displayName) ||
            this.name ||
            'Component'
        );
        this.__didWarnIsMounted = true;
      }
      return !!this.__isMounted;
    }
  };

  var ReactClassComponent = function() {};
  _assign(
    ReactClassComponent.prototype,
    ReactComponent.prototype,
    ReactClassMixin
  );

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  function createClass(spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function(props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (process.env.NODE_ENV !== 'production') {
        warning(
          this instanceof Constructor,
          'Something is calling a React component directly. Use a factory or ' +
            'JSX instead. See: https://fb.me/react-legacyfactory'
        );
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (process.env.NODE_ENV !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (
          initialState === undefined &&
          this.getInitialState._isMockFunction
        ) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      _invariant(
        typeof initialState === 'object' && !Array.isArray(initialState),
        '%s.getInitialState(): must return an object or null',
        Constructor.displayName || 'ReactCompositeComponent'
      );

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
    mixSpecIntoComponent(Constructor, spec);
    mixSpecIntoComponent(Constructor, IsMountedPostMixin);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (process.env.NODE_ENV !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    _invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    );

    if (process.env.NODE_ENV !== 'production') {
      warning(
        !Constructor.prototype.componentShouldUpdate,
        '%s has a method called ' +
          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
          'The name is phrased as a question because the function is ' +
          'expected to return a value.',
        spec.displayName || 'A component'
      );
      warning(
        !Constructor.prototype.componentWillRecieveProps,
        '%s has a method called ' +
          'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

module.exports = factory;

}).call(this,require('_process'))
},{"_process":171,"fbjs/lib/emptyObject":4,"fbjs/lib/invariant":5,"fbjs/lib/warning":6,"object-assign":129}],2:[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Based on code that is Copyright 2013-2015, Facebook, Inc.
  All rights reserved.
*/
/* global define */

(function () {
	'use strict';

	var canUseDOM = !!(
		typeof window !== 'undefined' &&
		window.document &&
		window.document.createElement
	);

	var ExecutionEnvironment = {

		canUseDOM: canUseDOM,

		canUseWorkers: typeof Worker !== 'undefined',

		canUseEventListeners:
			canUseDOM && !!(window.addEventListener || window.attachEvent),

		canUseViewport: canUseDOM && !!window.screen

	};

	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		define(function () {
			return ExecutionEnvironment;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = ExecutionEnvironment;
	} else {
		window.ExecutionEnvironment = ExecutionEnvironment;
	}

}());

},{}],3:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],4:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;
}).call(this,require('_process'))
},{"_process":171}],5:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))
},{"_process":171}],6:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
}).call(this,require('_process'))
},{"./emptyFunction":3,"_process":171}],7:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":67,"./_root":103}],8:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":74,"./_hashDelete":75,"./_hashGet":76,"./_hashHas":77,"./_hashSet":78}],9:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":86,"./_listCacheDelete":87,"./_listCacheGet":88,"./_listCacheHas":89,"./_listCacheSet":90}],10:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":67,"./_root":103}],11:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":91,"./_mapCacheDelete":92,"./_mapCacheGet":93,"./_mapCacheHas":94,"./_mapCacheSet":95}],12:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":67,"./_root":103}],13:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":67,"./_root":103}],14:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":11,"./_setCacheAdd":104,"./_setCacheHas":105}],15:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":9,"./_stackClear":107,"./_stackDelete":108,"./_stackGet":109,"./_stackHas":110,"./_stackSet":111}],16:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":103}],17:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":103}],18:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":67,"./_root":103}],19:[function(require,module,exports){
/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;

},{}],20:[function(require,module,exports){
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

module.exports = addSetEntry;

},{}],21:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],22:[function(require,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],23:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":43,"./_isIndex":82,"./isArguments":115,"./isArray":116,"./isBuffer":118,"./isTypedArray":124}],24:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],25:[function(require,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],26:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],27:[function(require,module,exports){
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

},{"./_baseAssignValue":31,"./eq":114}],28:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":114}],29:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":55,"./keys":125}],30:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;

},{"./_copyObject":55,"./keysIn":126}],31:[function(require,module,exports){
var defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

},{"./_defineProperty":59}],32:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    baseAssignIn = require('./_baseAssignIn'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    copySymbolsIn = require('./_copySymbolsIn'),
    getAllKeys = require('./_getAllKeys'),
    getAllKeysIn = require('./_getAllKeysIn'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isObject = require('./isObject'),
    keys = require('./keys');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":15,"./_arrayEach":21,"./_assignValue":27,"./_baseAssign":29,"./_baseAssignIn":30,"./_cloneBuffer":47,"./_copyArray":54,"./_copySymbols":56,"./_copySymbolsIn":57,"./_getAllKeys":64,"./_getAllKeysIn":65,"./_getTag":72,"./_initCloneArray":79,"./_initCloneByTag":80,"./_initCloneObject":81,"./isArray":116,"./isBuffer":118,"./isObject":122,"./keys":125}],33:[function(require,module,exports){
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;

},{"./isObject":122}],34:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":24,"./isArray":116}],35:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":16,"./_getRawTag":69,"./_objectToString":101}],36:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":35,"./isObjectLike":123}],37:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":38,"./isObjectLike":123}],38:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":15,"./_equalArrays":60,"./_equalByTag":61,"./_equalObjects":62,"./_getTag":72,"./isArray":116,"./isBuffer":118,"./isTypedArray":124}],39:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isMasked":84,"./_toSource":112,"./isFunction":120,"./isObject":122}],40:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":35,"./isLength":121,"./isObjectLike":123}],41:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":85,"./_nativeKeys":98}],42:[function(require,module,exports){
var isObject = require('./isObject'),
    isPrototype = require('./_isPrototype'),
    nativeKeysIn = require('./_nativeKeysIn');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;

},{"./_isPrototype":85,"./_nativeKeysIn":99,"./isObject":122}],43:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],44:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],45:[function(require,module,exports){
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],46:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":17}],47:[function(require,module,exports){
var root = require('./_root');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{"./_root":103}],48:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":46}],49:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;

},{"./_addMapEntry":19,"./_arrayReduce":25,"./_mapToArray":96}],50:[function(require,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],51:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;

},{"./_addSetEntry":20,"./_arrayReduce":25,"./_setToArray":106}],52:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":16}],53:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":46}],54:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],55:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    baseAssignValue = require('./_baseAssignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":27,"./_baseAssignValue":31}],56:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":55,"./_getSymbols":70}],57:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbolsIn = require('./_getSymbolsIn');

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;

},{"./_copyObject":55,"./_getSymbolsIn":71}],58:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":103}],59:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":67}],60:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome'),
    cacheHas = require('./_cacheHas');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":14,"./_arraySome":26,"./_cacheHas":45}],61:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":16,"./_Uint8Array":17,"./_equalArrays":60,"./_mapToArray":96,"./_setToArray":106,"./eq":114}],62:[function(require,module,exports){
var getAllKeys = require('./_getAllKeys');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

},{"./_getAllKeys":64}],63:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],64:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":34,"./_getSymbols":70,"./keys":125}],65:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbolsIn = require('./_getSymbolsIn'),
    keysIn = require('./keysIn');

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;

},{"./_baseGetAllKeys":34,"./_getSymbolsIn":71,"./keysIn":126}],66:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":83}],67:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":39,"./_getValue":73}],68:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":102}],69:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":16}],70:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    stubArray = require('./stubArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

},{"./_arrayFilter":22,"./stubArray":127}],71:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;

},{"./_arrayPush":24,"./_getPrototype":68,"./_getSymbols":70,"./stubArray":127}],72:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":7,"./_Map":10,"./_Promise":12,"./_Set":13,"./_WeakMap":18,"./_baseGetTag":35,"./_toSource":112}],73:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],74:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

},{"./_nativeCreate":97}],75:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

},{}],76:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":97}],77:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":97}],78:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":97}],79:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],80:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":46,"./_cloneDataView":48,"./_cloneMap":49,"./_cloneRegExp":50,"./_cloneSet":51,"./_cloneSymbol":52,"./_cloneTypedArray":53}],81:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":33,"./_getPrototype":68,"./_isPrototype":85}],82:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],83:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],84:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":58}],85:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],86:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

},{}],87:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":28}],88:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":28}],89:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":28}],90:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":28}],91:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":8,"./_ListCache":9,"./_Map":10}],92:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

},{"./_getMapData":66}],93:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":66}],94:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":66}],95:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":66}],96:[function(require,module,exports){
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],97:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":67}],98:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":102}],99:[function(require,module,exports){
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;

},{}],100:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":63}],101:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],102:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],103:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":63}],104:[function(require,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],105:[function(require,module,exports){
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],106:[function(require,module,exports){
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],107:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

},{"./_ListCache":9}],108:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

},{}],109:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],110:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],111:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

},{"./_ListCache":9,"./_Map":10,"./_MapCache":11}],112:[function(require,module,exports){
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],113:[function(require,module,exports){
var baseClone = require('./_baseClone');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;

},{"./_baseClone":32}],114:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],115:[function(require,module,exports){
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":36,"./isObjectLike":123}],116:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],117:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":120,"./isLength":121}],118:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":103,"./stubFalse":128}],119:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual');

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;

},{"./_baseIsEqual":37}],120:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":35,"./isObject":122}],121:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],122:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],123:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],124:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":40,"./_baseUnary":44,"./_nodeUtil":100}],125:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":23,"./_baseKeys":41,"./isArrayLike":117}],126:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeysIn = require('./_baseKeysIn'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

},{"./_arrayLikeKeys":23,"./_baseKeysIn":42,"./isArrayLike":117}],127:[function(require,module,exports){
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],128:[function(require,module,exports){
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],129:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],130:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

if (process.env.NODE_ENV !== 'production') {
  var invariant = require('fbjs/lib/invariant');
  var warning = require('fbjs/lib/warning');
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

}).call(this,require('_process'))
},{"./lib/ReactPropTypesSecret":135,"_process":171,"fbjs/lib/invariant":5,"fbjs/lib/warning":6}],131:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

// React 15.5 references this module, and assumes PropTypes are still callable in production.
// Therefore we re-export development-only version with all the PropTypes checks here.
// However if one is migrating to the `prop-types` npm library, they will go through the
// `index.js` entry point, and it will branch depending on the environment.
var factory = require('./factoryWithTypeCheckers');
module.exports = function(isValidElement) {
  // It is still allowed in 15.5.
  var throwOnDirectAccess = false;
  return factory(isValidElement, throwOnDirectAccess);
};

},{"./factoryWithTypeCheckers":133}],132:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":135,"fbjs/lib/emptyFunction":3,"fbjs/lib/invariant":5}],133:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');
var assign = require('object-assign');

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
var checkPropTypes = require('./checkPropTypes');

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

}).call(this,require('_process'))
},{"./checkPropTypes":130,"./lib/ReactPropTypesSecret":135,"_process":171,"fbjs/lib/emptyFunction":3,"fbjs/lib/invariant":5,"fbjs/lib/warning":6,"object-assign":129}],134:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

}).call(this,require('_process'))
},{"./factoryWithThrowingShims":132,"./factoryWithTypeCheckers":133,"_process":171}],135:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],136:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AbstractWidget = function (_React$Component) {
  _inherits(AbstractWidget, _React$Component);

  function AbstractWidget() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AbstractWidget);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AbstractWidget.__proto__ || Object.getPrototypeOf(AbstractWidget)).call.apply(_ref, [this].concat(args))), _this), _this.loadWidget = function () {
      var $script = require('scriptjs'); // eslint-disable-line global-require

      $script.ready('twitter-widgets', function () {
        if (!window.twttr) {
          // If the script tag fails to load, scriptjs.ready() will still trigger.
          // Let's avoid the JS exceptions when that happens.
          console.error('Failure to load window.twttr, aborting load.'); // eslint-disable-line no-console
          return;
        }

        // Delete existing
        AbstractWidget.removeChildren(_this.widgetWrapper);

        // Create widget
        _this.props.ready(window.twttr, _this.widgetWrapper, _this.done);
      });
    }, _this.done = function () {
      if (_this.willUnmount) {
        AbstractWidget.removeChildrenExceptLast(_this.widgetWrapper);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AbstractWidget, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.willUnmount = false;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadWidget();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.loadWidget();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.willUnmount = true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement('div', {
        ref: function ref(c) {
          _this2.widgetWrapper = c;
        }
      });
    }
  }], [{
    key: 'removeChildren',
    value: function removeChildren(node) {
      if (node) {
        while (node.firstChild) {
          node.removeChild(node.firstChild);
        }
      }
    }
  }, {
    key: 'removeChildrenExceptLast',
    value: function removeChildrenExceptLast(node) {
      if (node) {
        while (node.childNodes.length > 1) {
          node.removeChild(node.firstChild);
        }
      }
    }
  }]);

  return AbstractWidget;
}(_react2.default.Component);

AbstractWidget.propTypes = {
  ready: _propTypes2.default.func.isRequired
};
exports.default = AbstractWidget;
},{"prop-types":134,"react":168,"scriptjs":169}],137:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _AbstractWidget = require('./AbstractWidget');

var _AbstractWidget2 = _interopRequireDefault(_AbstractWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Follow = function (_React$Component) {
  _inherits(Follow, _React$Component);

  function Follow() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Follow);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Follow.__proto__ || Object.getPrototypeOf(Follow)).call.apply(_ref, [this].concat(args))), _this), _this.ready = function (tw, element, done) {
      var _this$props = _this.props,
          username = _this$props.username,
          options = _this$props.options,
          onLoad = _this$props.onLoad;

      // Options must be cloned since Twitter Widgets modifies it directly

      tw.widgets.createFollowButton(username, element, (0, _cloneDeep2.default)(options)).then(function () {
        // Widget is loaded
        done();
        onLoad();
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Follow, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      var changed = function changed(name) {
        return !(0, _isEqual2.default)(_this2.props[name], nextProps[name]);
      };
      return changed('username') || changed('options');
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_AbstractWidget2.default, { ready: this.ready });
    }
  }]);

  return Follow;
}(_react2.default.Component);

Follow.propTypes = {
  username: _propTypes2.default.string.isRequired,
  options: _propTypes2.default.object,
  onLoad: _propTypes2.default.func
};
Follow.defaultProps = {
  options: {},
  onLoad: function onLoad() {}
};
exports.default = Follow;
},{"./AbstractWidget":136,"lodash/cloneDeep":113,"lodash/isEqual":119,"prop-types":134,"react":168}],138:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _AbstractWidget = require('./AbstractWidget');

var _AbstractWidget2 = _interopRequireDefault(_AbstractWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hashtag = function (_React$Component) {
  _inherits(Hashtag, _React$Component);

  function Hashtag() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Hashtag);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Hashtag.__proto__ || Object.getPrototypeOf(Hashtag)).call.apply(_ref, [this].concat(args))), _this), _this.ready = function (tw, element, done) {
      var _this$props = _this.props,
          hashtag = _this$props.hashtag,
          options = _this$props.options,
          onLoad = _this$props.onLoad;

      // Options must be cloned since Twitter Widgets modifies it directly

      tw.widgets.createHashtagButton(hashtag, element, (0, _cloneDeep2.default)(options)).then(function () {
        // Widget is loaded
        done();
        onLoad();
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Hashtag, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      var changed = function changed(name) {
        return !(0, _isEqual2.default)(_this2.props[name], nextProps[name]);
      };
      return changed('hashtag') || changed('options');
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_AbstractWidget2.default, { ready: this.ready });
    }
  }]);

  return Hashtag;
}(_react2.default.Component);

Hashtag.propTypes = {
  hashtag: _propTypes2.default.string.isRequired,
  options: _propTypes2.default.object,
  onLoad: _propTypes2.default.func
};
Hashtag.defaultProps = {
  options: {},
  onLoad: function onLoad() {}
};
exports.default = Hashtag;
},{"./AbstractWidget":136,"lodash/cloneDeep":113,"lodash/isEqual":119,"prop-types":134,"react":168}],139:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _AbstractWidget = require('./AbstractWidget');

var _AbstractWidget2 = _interopRequireDefault(_AbstractWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mention = function (_React$Component) {
  _inherits(Mention, _React$Component);

  function Mention() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Mention);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Mention.__proto__ || Object.getPrototypeOf(Mention)).call.apply(_ref, [this].concat(args))), _this), _this.ready = function (tw, element, done) {
      var _this$props = _this.props,
          username = _this$props.username,
          options = _this$props.options,
          onLoad = _this$props.onLoad;

      // Options must be cloned since Twitter Widgets modifies it directly

      tw.widgets.createMentionButton(username, element, (0, _cloneDeep2.default)(options)).then(function () {
        // Widget is loaded
        done();
        onLoad();
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Mention, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      var changed = function changed(name) {
        return !(0, _isEqual2.default)(_this2.props[name], nextProps[name]);
      };
      return changed('username') || changed('options');
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_AbstractWidget2.default, { ready: this.ready });
    }
  }]);

  return Mention;
}(_react2.default.Component);

Mention.propTypes = {
  username: _propTypes2.default.string.isRequired,
  options: _propTypes2.default.object,
  onLoad: _propTypes2.default.func
};
Mention.defaultProps = {
  options: {},
  onLoad: function onLoad() {}
};
exports.default = Mention;
},{"./AbstractWidget":136,"lodash/cloneDeep":113,"lodash/isEqual":119,"prop-types":134,"react":168}],140:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _AbstractWidget = require('./AbstractWidget');

var _AbstractWidget2 = _interopRequireDefault(_AbstractWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Share = function (_React$Component) {
  _inherits(Share, _React$Component);

  function Share() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Share);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Share.__proto__ || Object.getPrototypeOf(Share)).call.apply(_ref, [this].concat(args))), _this), _this.ready = function (tw, element, done) {
      var _this$props = _this.props,
          url = _this$props.url,
          options = _this$props.options,
          onLoad = _this$props.onLoad;

      // Options must be cloned since Twitter Widgets modifies it directly

      tw.widgets.createShareButton(url, element, (0, _cloneDeep2.default)(options)).then(function () {
        // Widget is loaded
        done();
        onLoad();
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Share, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      var changed = function changed(name) {
        return !(0, _isEqual2.default)(_this2.props[name], nextProps[name]);
      };
      return changed('url') || changed('options');
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_AbstractWidget2.default, { ready: this.ready });
    }
  }]);

  return Share;
}(_react2.default.Component);

Share.propTypes = {
  url: _propTypes2.default.string.isRequired,
  options: _propTypes2.default.object,
  onLoad: _propTypes2.default.func
};
Share.defaultProps = {
  options: {},
  onLoad: function onLoad() {}
};
exports.default = Share;
},{"./AbstractWidget":136,"lodash/cloneDeep":113,"lodash/isEqual":119,"prop-types":134,"react":168}],141:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _AbstractWidget = require('./AbstractWidget');

var _AbstractWidget2 = _interopRequireDefault(_AbstractWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Timeline = function (_React$Component) {
  _inherits(Timeline, _React$Component);

  function Timeline() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Timeline);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call.apply(_ref, [this].concat(args))), _this), _this.ready = function (tw, element, done) {
      var _this$props = _this.props,
          dataSource = _this$props.dataSource,
          options = _this$props.options,
          onLoad = _this$props.onLoad;

      // Options and dataSource must be cloned since Twitter Widgets modifies it directly

      tw.widgets.createTimeline((0, _cloneDeep2.default)(dataSource), element, (0, _cloneDeep2.default)(options)).then(function () {
        // Widget is loaded
        done();
        onLoad();
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Timeline, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      var changed = function changed(name) {
        return !(0, _isEqual2.default)(_this2.props[name], nextProps[name]);
      };
      return changed('dataSource') || changed('options');
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_AbstractWidget2.default, { ready: this.ready });
    }
  }]);

  return Timeline;
}(_react2.default.Component);

Timeline.propTypes = {
  dataSource: _propTypes2.default.object.isRequired,
  options: _propTypes2.default.object,
  onLoad: _propTypes2.default.func
};
Timeline.defaultProps = {
  options: {},
  onLoad: function onLoad() {}
};
exports.default = Timeline;
},{"./AbstractWidget":136,"lodash/cloneDeep":113,"lodash/isEqual":119,"prop-types":134,"react":168}],142:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _AbstractWidget = require('./AbstractWidget');

var _AbstractWidget2 = _interopRequireDefault(_AbstractWidget);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tweet = function (_React$Component) {
  _inherits(Tweet, _React$Component);

  function Tweet() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Tweet);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Tweet.__proto__ || Object.getPrototypeOf(Tweet)).call.apply(_ref, [this].concat(args))), _this), _this.ready = function (tw, element, done) {
      var _this$props = _this.props,
          tweetId = _this$props.tweetId,
          options = _this$props.options,
          onLoad = _this$props.onLoad;

      // Options must be cloned since Twitter Widgets modifies it directly

      tw.widgets.createTweet(tweetId, element, (0, _cloneDeep2.default)(options)).then(function () {
        // Widget is loaded
        done();
        onLoad();
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Tweet, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      var changed = function changed(name) {
        return !(0, _isEqual2.default)(_this2.props[name], nextProps[name]);
      };
      return changed('tweetId') || changed('options');
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_AbstractWidget2.default, { ready: this.ready });
    }
  }]);

  return Tweet;
}(_react2.default.Component);

Tweet.propTypes = {
  tweetId: _propTypes2.default.string.isRequired,
  options: _propTypes2.default.object,
  onLoad: _propTypes2.default.func
};
Tweet.defaultProps = {
  options: {},
  onLoad: function onLoad() {}
};
exports.default = Tweet;
},{"./AbstractWidget":136,"lodash/cloneDeep":113,"lodash/isEqual":119,"prop-types":134,"react":168}],143:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tweet = exports.Timeline = exports.Share = exports.Mention = exports.Hashtag = exports.Follow = undefined;

var _exenv = require('exenv');

var _Follow2 = require('./components/Follow');

var _Follow3 = _interopRequireDefault(_Follow2);

var _Hashtag2 = require('./components/Hashtag');

var _Hashtag3 = _interopRequireDefault(_Hashtag2);

var _Mention2 = require('./components/Mention');

var _Mention3 = _interopRequireDefault(_Mention2);

var _Share2 = require('./components/Share');

var _Share3 = _interopRequireDefault(_Share2);

var _Timeline2 = require('./components/Timeline');

var _Timeline3 = _interopRequireDefault(_Timeline2);

var _Tweet2 = require('./components/Tweet');

var _Tweet3 = _interopRequireDefault(_Tweet2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_exenv.canUseDOM) {
  var $script = require('scriptjs'); // eslint-disable-line global-require
  $script('https://platform.twitter.com/widgets.js', 'twitter-widgets');
}

exports.Follow = _Follow3.default;
exports.Hashtag = _Hashtag3.default;
exports.Mention = _Mention3.default;
exports.Share = _Share3.default;
exports.Timeline = _Timeline3.default;
exports.Tweet = _Tweet3.default;
},{"./components/Follow":137,"./components/Hashtag":138,"./components/Mention":139,"./components/Share":140,"./components/Timeline":141,"./components/Tweet":142,"exenv":2,"scriptjs":169}],144:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use strict';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * Unescape and unwrap key for human-readable display
 *
 * @param {string} key to unescape.
 * @return {string} the unescaped key.
 */
function unescape(key) {
  var unescapeRegex = /(=0|=2)/g;
  var unescaperLookup = {
    '=0': '=',
    '=2': ':'
  };
  var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);

  return ('' + keySubstring).replace(unescapeRegex, function (match) {
    return unescaperLookup[match];
  });
}

var KeyEscapeUtils = {
  escape: escape,
  unescape: unescape
};

module.exports = KeyEscapeUtils;
},{}],145:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function (copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler = function (a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function (a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fourArgumentPooler = function (a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

var standardReleaser = function (instance) {
  var Klass = this;
  !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances.
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function (CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fourArgumentPooler: fourArgumentPooler
};

module.exports = PooledClass;
}).call(this,require('_process'))
},{"./reactProdInvariant":166,"_process":171,"fbjs/lib/invariant":5}],146:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _assign = require('object-assign');

var ReactBaseClasses = require('./ReactBaseClasses');
var ReactChildren = require('./ReactChildren');
var ReactDOMFactories = require('./ReactDOMFactories');
var ReactElement = require('./ReactElement');
var ReactPropTypes = require('./ReactPropTypes');
var ReactVersion = require('./ReactVersion');

var createReactClass = require('./createClass');
var onlyChild = require('./onlyChild');

var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;
var cloneElement = ReactElement.cloneElement;

if (process.env.NODE_ENV !== 'production') {
  var lowPriorityWarning = require('./lowPriorityWarning');
  var canDefineProperty = require('./canDefineProperty');
  var ReactElementValidator = require('./ReactElementValidator');
  var didWarnPropTypesDeprecated = false;
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
  cloneElement = ReactElementValidator.cloneElement;
}

var __spread = _assign;
var createMixin = function (mixin) {
  return mixin;
};

if (process.env.NODE_ENV !== 'production') {
  var warnedForSpread = false;
  var warnedForCreateMixin = false;
  __spread = function () {
    lowPriorityWarning(warnedForSpread, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.');
    warnedForSpread = true;
    return _assign.apply(null, arguments);
  };

  createMixin = function (mixin) {
    lowPriorityWarning(warnedForCreateMixin, 'React.createMixin is deprecated and should not be used. ' + 'In React v16.0, it will be removed. ' + 'You can use this mixin directly instead. ' + 'See https://fb.me/createmixin-was-never-implemented for more info.');
    warnedForCreateMixin = true;
    return mixin;
  };
}

var React = {
  // Modern

  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    toArray: ReactChildren.toArray,
    only: onlyChild
  },

  Component: ReactBaseClasses.Component,
  PureComponent: ReactBaseClasses.PureComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement.isValidElement,

  // Classic

  PropTypes: ReactPropTypes,
  createClass: createReactClass,
  createFactory: createFactory,
  createMixin: createMixin,

  // This looks DOM specific but these are actually isomorphic helpers
  // since they are just generating DOM strings.
  DOM: ReactDOMFactories,

  version: ReactVersion,

  // Deprecated hook for JSX spread, don't use this for anything.
  __spread: __spread
};

if (process.env.NODE_ENV !== 'production') {
  var warnedForCreateClass = false;
  if (canDefineProperty) {
    Object.defineProperty(React, 'PropTypes', {
      get: function () {
        lowPriorityWarning(didWarnPropTypesDeprecated, 'Accessing PropTypes via the main React package is deprecated,' + ' and will be removed in  React v16.0.' + ' Use the latest available v15.* prop-types package from npm instead.' + ' For info on usage, compatibility, migration and more, see ' + 'https://fb.me/prop-types-docs');
        didWarnPropTypesDeprecated = true;
        return ReactPropTypes;
      }
    });

    Object.defineProperty(React, 'createClass', {
      get: function () {
        lowPriorityWarning(warnedForCreateClass, 'Accessing createClass via the main React package is deprecated,' + ' and will be removed in React v16.0.' + " Use a plain JavaScript class instead. If you're not yet " + 'ready to migrate, create-react-class v15.* is available ' + 'on npm as a temporary, drop-in replacement. ' + 'For more info see https://fb.me/react-create-class');
        warnedForCreateClass = true;
        return createReactClass;
      }
    });
  }

  // React.DOM factories are deprecated. Wrap these methods so that
  // invocations of the React.DOM namespace and alert users to switch
  // to the `react-dom-factories` package.
  React.DOM = {};
  var warnedForFactories = false;
  Object.keys(ReactDOMFactories).forEach(function (factory) {
    React.DOM[factory] = function () {
      if (!warnedForFactories) {
        lowPriorityWarning(false, 'Accessing factories like React.DOM.%s has been deprecated ' + 'and will be removed in v16.0+. Use the ' + 'react-dom-factories package instead. ' + ' Version 1.0 provides a drop-in replacement.' + ' For more info, see https://fb.me/react-dom-factories', factory);
        warnedForFactories = true;
      }
      return ReactDOMFactories[factory].apply(ReactDOMFactories, arguments);
    };
  });
}

module.exports = React;
}).call(this,require('_process'))
},{"./ReactBaseClasses":147,"./ReactChildren":148,"./ReactDOMFactories":151,"./ReactElement":152,"./ReactElementValidator":154,"./ReactPropTypes":157,"./ReactVersion":159,"./canDefineProperty":160,"./createClass":162,"./lowPriorityWarning":164,"./onlyChild":165,"_process":171,"object-assign":129}],147:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var canDefineProperty = require('./canDefineProperty');
var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var lowPriorityWarning = require('./lowPriorityWarning');

/**
 * Base class helpers for the updating state of a component.
 */
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
ReactComponent.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : _prodInvariant('85') : void 0;
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
ReactComponent.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'forceUpdate');
  }
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
if (process.env.NODE_ENV !== 'production') {
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    if (canDefineProperty) {
      Object.defineProperty(ReactComponent.prototype, methodName, {
        get: function () {
          lowPriorityWarning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
          return undefined;
        }
      });
    }
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

/**
 * Base class helpers for the updating state of a component.
 */
function ReactPureComponent(props, context, updater) {
  // Duplicated from ReactComponent.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

function ComponentDummy() {}
ComponentDummy.prototype = ReactComponent.prototype;
ReactPureComponent.prototype = new ComponentDummy();
ReactPureComponent.prototype.constructor = ReactPureComponent;
// Avoid an extra prototype jump for these methods.
_assign(ReactPureComponent.prototype, ReactComponent.prototype);
ReactPureComponent.prototype.isPureReactComponent = true;

module.exports = {
  Component: ReactComponent,
  PureComponent: ReactPureComponent
};
}).call(this,require('_process'))
},{"./ReactNoopUpdateQueue":155,"./canDefineProperty":160,"./lowPriorityWarning":164,"./reactProdInvariant":166,"_process":171,"fbjs/lib/emptyObject":4,"fbjs/lib/invariant":5,"object-assign":129}],148:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var PooledClass = require('./PooledClass');
var ReactElement = require('./ReactElement');

var emptyFunction = require('fbjs/lib/emptyFunction');
var traverseAllChildren = require('./traverseAllChildren');

var twoArgumentPooler = PooledClass.twoArgumentPooler;
var fourArgumentPooler = PooledClass.fourArgumentPooler;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */
function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.func = forEachFunction;
  this.context = forEachContext;
  this.count = 0;
}
ForEachBookKeeping.prototype.destructor = function () {
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */
function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}
MapBookKeeping.prototype.destructor = function () {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
  } else if (mappedChild != null) {
    if (ReactElement.isValidElement(mappedChild)) {
      mappedChild = ReactElement.cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

function forEachSingleChildDummy(traverseContext, child, name) {
  return null;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, forEachSingleChildDummy, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.toarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
  return result;
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
  count: countChildren,
  toArray: toArray
};

module.exports = ReactChildren;
},{"./PooledClass":145,"./ReactElement":152,"./traverseAllChildren":167,"fbjs/lib/emptyFunction":3}],149:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

function isNative(fn) {
  // Based on isNative() from Lodash
  var funcToString = Function.prototype.toString;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var reIsNative = RegExp('^' + funcToString
  // Take an example native function source for comparison
  .call(hasOwnProperty
  // Strip regex characters so we can use it for regex
  ).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'
  // Remove hasOwnProperty from the template to make it generic
  ).replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  try {
    var source = funcToString.call(fn);
    return reIsNative.test(source);
  } catch (err) {
    return false;
  }
}

var canUseCollections =
// Array.from
typeof Array.from === 'function' &&
// Map
typeof Map === 'function' && isNative(Map) &&
// Map.prototype.keys
Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
// Set
typeof Set === 'function' && isNative(Set) &&
// Set.prototype.keys
Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

var setItem;
var getItem;
var removeItem;
var getItemIDs;
var addRoot;
var removeRoot;
var getRootIDs;

if (canUseCollections) {
  var itemMap = new Map();
  var rootIDSet = new Set();

  setItem = function (id, item) {
    itemMap.set(id, item);
  };
  getItem = function (id) {
    return itemMap.get(id);
  };
  removeItem = function (id) {
    itemMap['delete'](id);
  };
  getItemIDs = function () {
    return Array.from(itemMap.keys());
  };

  addRoot = function (id) {
    rootIDSet.add(id);
  };
  removeRoot = function (id) {
    rootIDSet['delete'](id);
  };
  getRootIDs = function () {
    return Array.from(rootIDSet.keys());
  };
} else {
  var itemByKey = {};
  var rootByKey = {};

  // Use non-numeric keys to prevent V8 performance issues:
  // https://github.com/facebook/react/pull/7232
  var getKeyFromID = function (id) {
    return '.' + id;
  };
  var getIDFromKey = function (key) {
    return parseInt(key.substr(1), 10);
  };

  setItem = function (id, item) {
    var key = getKeyFromID(id);
    itemByKey[key] = item;
  };
  getItem = function (id) {
    var key = getKeyFromID(id);
    return itemByKey[key];
  };
  removeItem = function (id) {
    var key = getKeyFromID(id);
    delete itemByKey[key];
  };
  getItemIDs = function () {
    return Object.keys(itemByKey).map(getIDFromKey);
  };

  addRoot = function (id) {
    var key = getKeyFromID(id);
    rootByKey[key] = true;
  };
  removeRoot = function (id) {
    var key = getKeyFromID(id);
    delete rootByKey[key];
  };
  getRootIDs = function () {
    return Object.keys(rootByKey).map(getIDFromKey);
  };
}

var unmountedIDs = [];

function purgeDeep(id) {
  var item = getItem(id);
  if (item) {
    var childIDs = item.childIDs;

    removeItem(id);
    childIDs.forEach(purgeDeep);
  }
}

function describeComponentFrame(name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
}

function getDisplayName(element) {
  if (element == null) {
    return '#empty';
  } else if (typeof element === 'string' || typeof element === 'number') {
    return '#text';
  } else if (typeof element.type === 'string') {
    return element.type;
  } else {
    return element.type.displayName || element.type.name || 'Unknown';
  }
}

function describeID(id) {
  var name = ReactComponentTreeHook.getDisplayName(id);
  var element = ReactComponentTreeHook.getElement(id);
  var ownerID = ReactComponentTreeHook.getOwnerID(id);
  var ownerName;
  if (ownerID) {
    ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
  }
  process.env.NODE_ENV !== 'production' ? warning(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id) : void 0;
  return describeComponentFrame(name, element && element._source, ownerName);
}

var ReactComponentTreeHook = {
  onSetChildren: function (id, nextChildIDs) {
    var item = getItem(id);
    !item ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Item must have been set') : _prodInvariant('144') : void 0;
    item.childIDs = nextChildIDs;

    for (var i = 0; i < nextChildIDs.length; i++) {
      var nextChildID = nextChildIDs[i];
      var nextChild = getItem(nextChildID);
      !nextChild ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('140') : void 0;
      !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : _prodInvariant('141') : void 0;
      !nextChild.isMounted ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('71') : void 0;
      if (nextChild.parentID == null) {
        nextChild.parentID = id;
        // TODO: This shouldn't be necessary but mounting a new root during in
        // componentWillMount currently causes not-yet-mounted components to
        // be purged from our tree data so their parent id is missing.
      }
      !(nextChild.parentID === id) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : _prodInvariant('142', nextChildID, nextChild.parentID, id) : void 0;
    }
  },
  onBeforeMountComponent: function (id, element, parentID) {
    var item = {
      element: element,
      parentID: parentID,
      text: null,
      childIDs: [],
      isMounted: false,
      updateCount: 0
    };
    setItem(id, item);
  },
  onBeforeUpdateComponent: function (id, element) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.element = element;
  },
  onMountComponent: function (id) {
    var item = getItem(id);
    !item ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Item must have been set') : _prodInvariant('144') : void 0;
    item.isMounted = true;
    var isRoot = item.parentID === 0;
    if (isRoot) {
      addRoot(id);
    }
  },
  onUpdateComponent: function (id) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.updateCount++;
  },
  onUnmountComponent: function (id) {
    var item = getItem(id);
    if (item) {
      // We need to check if it exists.
      // `item` might not exist if it is inside an error boundary, and a sibling
      // error boundary child threw while mounting. Then this instance never
      // got a chance to mount, but it still gets an unmounting event during
      // the error boundary cleanup.
      item.isMounted = false;
      var isRoot = item.parentID === 0;
      if (isRoot) {
        removeRoot(id);
      }
    }
    unmountedIDs.push(id);
  },
  purgeUnmountedComponents: function () {
    if (ReactComponentTreeHook._preventPurging) {
      // Should only be used for testing.
      return;
    }

    for (var i = 0; i < unmountedIDs.length; i++) {
      var id = unmountedIDs[i];
      purgeDeep(id);
    }
    unmountedIDs.length = 0;
  },
  isMounted: function (id) {
    var item = getItem(id);
    return item ? item.isMounted : false;
  },
  getCurrentStackAddendum: function (topElement) {
    var info = '';
    if (topElement) {
      var name = getDisplayName(topElement);
      var owner = topElement._owner;
      info += describeComponentFrame(name, topElement._source, owner && owner.getName());
    }

    var currentOwner = ReactCurrentOwner.current;
    var id = currentOwner && currentOwner._debugID;

    info += ReactComponentTreeHook.getStackAddendumByID(id);
    return info;
  },
  getStackAddendumByID: function (id) {
    var info = '';
    while (id) {
      info += describeID(id);
      id = ReactComponentTreeHook.getParentID(id);
    }
    return info;
  },
  getChildIDs: function (id) {
    var item = getItem(id);
    return item ? item.childIDs : [];
  },
  getDisplayName: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element) {
      return null;
    }
    return getDisplayName(element);
  },
  getElement: function (id) {
    var item = getItem(id);
    return item ? item.element : null;
  },
  getOwnerID: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element || !element._owner) {
      return null;
    }
    return element._owner._debugID;
  },
  getParentID: function (id) {
    var item = getItem(id);
    return item ? item.parentID : null;
  },
  getSource: function (id) {
    var item = getItem(id);
    var element = item ? item.element : null;
    var source = element != null ? element._source : null;
    return source;
  },
  getText: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (typeof element === 'string') {
      return element;
    } else if (typeof element === 'number') {
      return '' + element;
    } else {
      return null;
    }
  },
  getUpdateCount: function (id) {
    var item = getItem(id);
    return item ? item.updateCount : 0;
  },


  getRootIDs: getRootIDs,
  getRegisteredIDs: getItemIDs,

  pushNonStandardWarningStack: function (isCreatingElement, currentSource) {
    if (typeof console.reactStack !== 'function') {
      return;
    }

    var stack = [];
    var currentOwner = ReactCurrentOwner.current;
    var id = currentOwner && currentOwner._debugID;

    try {
      if (isCreatingElement) {
        stack.push({
          name: id ? ReactComponentTreeHook.getDisplayName(id) : null,
          fileName: currentSource ? currentSource.fileName : null,
          lineNumber: currentSource ? currentSource.lineNumber : null
        });
      }

      while (id) {
        var element = ReactComponentTreeHook.getElement(id);
        var parentID = ReactComponentTreeHook.getParentID(id);
        var ownerID = ReactComponentTreeHook.getOwnerID(id);
        var ownerName = ownerID ? ReactComponentTreeHook.getDisplayName(ownerID) : null;
        var source = element && element._source;
        stack.push({
          name: ownerName,
          fileName: source ? source.fileName : null,
          lineNumber: source ? source.lineNumber : null
        });
        id = parentID;
      }
    } catch (err) {
      // Internal state is messed up.
      // Stop building the stack (it's just a nice to have).
    }

    console.reactStack(stack);
  },
  popNonStandardWarningStack: function () {
    if (typeof console.reactStackEnd !== 'function') {
      return;
    }
    console.reactStackEnd();
  }
};

module.exports = ReactComponentTreeHook;
}).call(this,require('_process'))
},{"./ReactCurrentOwner":150,"./reactProdInvariant":166,"_process":171,"fbjs/lib/invariant":5,"fbjs/lib/warning":6}],150:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use strict';

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

module.exports = ReactCurrentOwner;
},{}],151:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var ReactElement = require('./ReactElement');

/**
 * Create a factory that creates HTML tag elements.
 *
 * @private
 */
var createDOMFactory = ReactElement.createFactory;
if (process.env.NODE_ENV !== 'production') {
  var ReactElementValidator = require('./ReactElementValidator');
  createDOMFactory = ReactElementValidator.createFactory;
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 *
 * @public
 */
var ReactDOMFactories = {
  a: createDOMFactory('a'),
  abbr: createDOMFactory('abbr'),
  address: createDOMFactory('address'),
  area: createDOMFactory('area'),
  article: createDOMFactory('article'),
  aside: createDOMFactory('aside'),
  audio: createDOMFactory('audio'),
  b: createDOMFactory('b'),
  base: createDOMFactory('base'),
  bdi: createDOMFactory('bdi'),
  bdo: createDOMFactory('bdo'),
  big: createDOMFactory('big'),
  blockquote: createDOMFactory('blockquote'),
  body: createDOMFactory('body'),
  br: createDOMFactory('br'),
  button: createDOMFactory('button'),
  canvas: createDOMFactory('canvas'),
  caption: createDOMFactory('caption'),
  cite: createDOMFactory('cite'),
  code: createDOMFactory('code'),
  col: createDOMFactory('col'),
  colgroup: createDOMFactory('colgroup'),
  data: createDOMFactory('data'),
  datalist: createDOMFactory('datalist'),
  dd: createDOMFactory('dd'),
  del: createDOMFactory('del'),
  details: createDOMFactory('details'),
  dfn: createDOMFactory('dfn'),
  dialog: createDOMFactory('dialog'),
  div: createDOMFactory('div'),
  dl: createDOMFactory('dl'),
  dt: createDOMFactory('dt'),
  em: createDOMFactory('em'),
  embed: createDOMFactory('embed'),
  fieldset: createDOMFactory('fieldset'),
  figcaption: createDOMFactory('figcaption'),
  figure: createDOMFactory('figure'),
  footer: createDOMFactory('footer'),
  form: createDOMFactory('form'),
  h1: createDOMFactory('h1'),
  h2: createDOMFactory('h2'),
  h3: createDOMFactory('h3'),
  h4: createDOMFactory('h4'),
  h5: createDOMFactory('h5'),
  h6: createDOMFactory('h6'),
  head: createDOMFactory('head'),
  header: createDOMFactory('header'),
  hgroup: createDOMFactory('hgroup'),
  hr: createDOMFactory('hr'),
  html: createDOMFactory('html'),
  i: createDOMFactory('i'),
  iframe: createDOMFactory('iframe'),
  img: createDOMFactory('img'),
  input: createDOMFactory('input'),
  ins: createDOMFactory('ins'),
  kbd: createDOMFactory('kbd'),
  keygen: createDOMFactory('keygen'),
  label: createDOMFactory('label'),
  legend: createDOMFactory('legend'),
  li: createDOMFactory('li'),
  link: createDOMFactory('link'),
  main: createDOMFactory('main'),
  map: createDOMFactory('map'),
  mark: createDOMFactory('mark'),
  menu: createDOMFactory('menu'),
  menuitem: createDOMFactory('menuitem'),
  meta: createDOMFactory('meta'),
  meter: createDOMFactory('meter'),
  nav: createDOMFactory('nav'),
  noscript: createDOMFactory('noscript'),
  object: createDOMFactory('object'),
  ol: createDOMFactory('ol'),
  optgroup: createDOMFactory('optgroup'),
  option: createDOMFactory('option'),
  output: createDOMFactory('output'),
  p: createDOMFactory('p'),
  param: createDOMFactory('param'),
  picture: createDOMFactory('picture'),
  pre: createDOMFactory('pre'),
  progress: createDOMFactory('progress'),
  q: createDOMFactory('q'),
  rp: createDOMFactory('rp'),
  rt: createDOMFactory('rt'),
  ruby: createDOMFactory('ruby'),
  s: createDOMFactory('s'),
  samp: createDOMFactory('samp'),
  script: createDOMFactory('script'),
  section: createDOMFactory('section'),
  select: createDOMFactory('select'),
  small: createDOMFactory('small'),
  source: createDOMFactory('source'),
  span: createDOMFactory('span'),
  strong: createDOMFactory('strong'),
  style: createDOMFactory('style'),
  sub: createDOMFactory('sub'),
  summary: createDOMFactory('summary'),
  sup: createDOMFactory('sup'),
  table: createDOMFactory('table'),
  tbody: createDOMFactory('tbody'),
  td: createDOMFactory('td'),
  textarea: createDOMFactory('textarea'),
  tfoot: createDOMFactory('tfoot'),
  th: createDOMFactory('th'),
  thead: createDOMFactory('thead'),
  time: createDOMFactory('time'),
  title: createDOMFactory('title'),
  tr: createDOMFactory('tr'),
  track: createDOMFactory('track'),
  u: createDOMFactory('u'),
  ul: createDOMFactory('ul'),
  'var': createDOMFactory('var'),
  video: createDOMFactory('video'),
  wbr: createDOMFactory('wbr'),

  // SVG
  circle: createDOMFactory('circle'),
  clipPath: createDOMFactory('clipPath'),
  defs: createDOMFactory('defs'),
  ellipse: createDOMFactory('ellipse'),
  g: createDOMFactory('g'),
  image: createDOMFactory('image'),
  line: createDOMFactory('line'),
  linearGradient: createDOMFactory('linearGradient'),
  mask: createDOMFactory('mask'),
  path: createDOMFactory('path'),
  pattern: createDOMFactory('pattern'),
  polygon: createDOMFactory('polygon'),
  polyline: createDOMFactory('polyline'),
  radialGradient: createDOMFactory('radialGradient'),
  rect: createDOMFactory('rect'),
  stop: createDOMFactory('stop'),
  svg: createDOMFactory('svg'),
  text: createDOMFactory('text'),
  tspan: createDOMFactory('tspan')
};

module.exports = ReactDOMFactories;
}).call(this,require('_process'))
},{"./ReactElement":152,"./ReactElementValidator":154,"_process":171}],152:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _assign = require('object-assign');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var warning = require('fbjs/lib/warning');
var canDefineProperty = require('./canDefineProperty');
var hasOwnProperty = Object.prototype.hasOwnProperty;

var REACT_ELEMENT_TYPE = require('./ReactElementSymbol');

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown, specialPropRefWarningShown;

function hasValidRef(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  if (process.env.NODE_ENV !== 'production') {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    if (canDefineProperty) {
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
    } else {
      element._store.validated = false;
      element._self = self;
      element._source = source;
    }
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
 */
ReactElement.createElement = function (type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (process.env.NODE_ENV !== 'production') {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    if (key || ref) {
      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
};

/**
 * Return a function that produces ReactElements of a given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
 */
ReactElement.createFactory = function (type) {
  var factory = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook TODO: Warn if this is accessed
  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
};

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
 */
ReactElement.cloneElement = function (element, config, children) {
  var propName;

  // Original props are copied
  var props = _assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
};

/**
 * Verifies the object is a ReactElement.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function (object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
};

module.exports = ReactElement;
}).call(this,require('_process'))
},{"./ReactCurrentOwner":150,"./ReactElementSymbol":153,"./canDefineProperty":160,"_process":171,"fbjs/lib/warning":6,"object-assign":129}],153:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use strict';

// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.

var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

module.exports = REACT_ELEMENT_TYPE;
},{}],154:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

'use strict';

var ReactCurrentOwner = require('./ReactCurrentOwner');
var ReactComponentTreeHook = require('./ReactComponentTreeHook');
var ReactElement = require('./ReactElement');

var checkReactTypeSpec = require('./checkReactTypeSpec');

var canDefineProperty = require('./canDefineProperty');
var getIteratorFn = require('./getIteratorFn');
var warning = require('fbjs/lib/warning');
var lowPriorityWarning = require('./lowPriorityWarning');

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = ReactCurrentOwner.current.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

function getSourceInfoErrorAddendum(elementProps) {
  if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
    var source = elementProps.__source;
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return ' Check your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = ' Check the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var memoizer = ownerHasKeyUseWarning.uniqueKey || (ownerHasKeyUseWarning.uniqueKey = {});

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (memoizer[currentComponentErrorInfo]) {
    return;
  }
  memoizer[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
  }

  process.env.NODE_ENV !== 'production' ? warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, ReactComponentTreeHook.getCurrentStackAddendum(element)) : void 0;
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (ReactElement.isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (ReactElement.isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    // Entry iterators provide implicit keys.
    if (iteratorFn) {
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).done) {
          if (ReactElement.isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var componentClass = element.type;
  if (typeof componentClass !== 'function') {
    return;
  }
  var name = componentClass.displayName || componentClass.name;
  if (componentClass.propTypes) {
    checkReactTypeSpec(componentClass.propTypes, element.props, 'prop', name, element, null);
  }
  if (typeof componentClass.getDefaultProps === 'function') {
    process.env.NODE_ENV !== 'production' ? warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
  }
}

var ReactElementValidator = {
  createElement: function (type, props, children) {
    var validType = typeof type === 'string' || typeof type === 'function';
    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      if (typeof type !== 'function' && typeof type !== 'string') {
        var info = '';
        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + "it's defined in.";
        }

        var sourceInfo = getSourceInfoErrorAddendum(props);
        if (sourceInfo) {
          info += sourceInfo;
        } else {
          info += getDeclarationErrorAddendum();
        }

        info += ReactComponentTreeHook.getCurrentStackAddendum();

        var currentSource = props !== null && props !== undefined && props.__source !== undefined ? props.__source : null;
        ReactComponentTreeHook.pushNonStandardWarningStack(true, currentSource);
        process.env.NODE_ENV !== 'production' ? warning(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : typeof type, info) : void 0;
        ReactComponentTreeHook.popNonStandardWarningStack();
      }
    }

    var element = ReactElement.createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    validatePropTypes(element);

    return element;
  },

  createFactory: function (type) {
    var validatedFactory = ReactElementValidator.createElement.bind(null, type);
    // Legacy hook TODO: Warn if this is accessed
    validatedFactory.type = type;

    if (process.env.NODE_ENV !== 'production') {
      if (canDefineProperty) {
        Object.defineProperty(validatedFactory, 'type', {
          enumerable: false,
          get: function () {
            lowPriorityWarning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
            Object.defineProperty(this, 'type', {
              value: type
            });
            return type;
          }
        });
      }
    }

    return validatedFactory;
  },

  cloneElement: function (element, props, children) {
    var newElement = ReactElement.cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }
};

module.exports = ReactElementValidator;
}).call(this,require('_process'))
},{"./ReactComponentTreeHook":149,"./ReactCurrentOwner":150,"./ReactElement":152,"./canDefineProperty":160,"./checkReactTypeSpec":161,"./getIteratorFn":163,"./lowPriorityWarning":164,"_process":171,"fbjs/lib/warning":6}],155:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var warning = require('fbjs/lib/warning');

function warnNoop(publicInstance, callerName) {
  if (process.env.NODE_ENV !== 'production') {
    var constructor = publicInstance.constructor;
    process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @internal
   */
  enqueueCallback: function (publicInstance, callback) {},

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState) {
    warnNoop(publicInstance, 'setState');
  }
};

module.exports = ReactNoopUpdateQueue;
}).call(this,require('_process'))
},{"_process":171,"fbjs/lib/warning":6}],156:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use strict';

var ReactPropTypeLocationNames = {};

if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
}

module.exports = ReactPropTypeLocationNames;
}).call(this,require('_process'))
},{"_process":171}],157:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _require = require('./ReactElement'),
    isValidElement = _require.isValidElement;

var factory = require('prop-types/factory');

module.exports = factory(isValidElement);
},{"./ReactElement":152,"prop-types/factory":131}],158:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;
},{}],159:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

module.exports = '15.6.2';
},{}],160:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use strict';

var canDefineProperty = false;
if (process.env.NODE_ENV !== 'production') {
  try {
    // $FlowFixMe https://github.com/facebook/flow/issues/285
    Object.defineProperty({}, 'x', { get: function () {} });
    canDefineProperty = true;
  } catch (x) {
    // IE will fail on defineProperty
  }
}

module.exports = canDefineProperty;
}).call(this,require('_process'))
},{"_process":171}],161:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var ReactComponentTreeHook;

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook = require('./ReactComponentTreeHook');
}

var loggedTypeFailures = {};

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?object} element The React element that is being type-checked
 * @param {?number} debugID The React component instance that is being type-checked
 * @private
 */
function checkReactTypeSpec(typeSpecs, values, location, componentName, element, debugID) {
  for (var typeSpecName in typeSpecs) {
    if (typeSpecs.hasOwnProperty(typeSpecName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        // This is intentionally an invariant that gets caught. It's the same
        // behavior as without this statement except with a better message.
        !(typeof typeSpecs[typeSpecName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : _prodInvariant('84', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : void 0;
        error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
      } catch (ex) {
        error = ex;
      }
      process.env.NODE_ENV !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName, typeof error) : void 0;
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;

        var componentStackInfo = '';

        if (process.env.NODE_ENV !== 'production') {
          if (!ReactComponentTreeHook) {
            ReactComponentTreeHook = require('./ReactComponentTreeHook');
          }
          if (debugID !== null) {
            componentStackInfo = ReactComponentTreeHook.getStackAddendumByID(debugID);
          } else if (element !== null) {
            componentStackInfo = ReactComponentTreeHook.getCurrentStackAddendum(element);
          }
        }

        process.env.NODE_ENV !== 'production' ? warning(false, 'Failed %s type: %s%s', location, error.message, componentStackInfo) : void 0;
      }
    }
  }
}

module.exports = checkReactTypeSpec;
}).call(this,require('_process'))
},{"./ReactComponentTreeHook":149,"./ReactPropTypeLocationNames":156,"./ReactPropTypesSecret":158,"./reactProdInvariant":166,"_process":171,"fbjs/lib/invariant":5,"fbjs/lib/warning":6}],162:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _require = require('./ReactBaseClasses'),
    Component = _require.Component;

var _require2 = require('./ReactElement'),
    isValidElement = _require2.isValidElement;

var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');
var factory = require('create-react-class/factory');

module.exports = factory(Component, isValidElement, ReactNoopUpdateQueue);
},{"./ReactBaseClasses":147,"./ReactElement":152,"./ReactNoopUpdateQueue":155,"create-react-class/factory":1}],163:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use strict';

/* global Symbol */

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

/**
 * Returns the iterator method function contained on the iterable object.
 *
 * Be sure to invoke the function with the iterable as context:
 *
 *     var iteratorFn = getIteratorFn(myIterable);
 *     if (iteratorFn) {
 *       var iterator = iteratorFn.call(myIterable);
 *       ...
 *     }
 *
 * @param {?object} maybeIterable
 * @return {?function}
 */
function getIteratorFn(maybeIterable) {
  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

module.exports = getIteratorFn;
},{}],164:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning = function () {};

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function (format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function (condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = lowPriorityWarning;
}).call(this,require('_process'))
},{"_process":171}],165:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactElement = require('./ReactElement');

var invariant = require('fbjs/lib/invariant');

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !ReactElement.isValidElement(children) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'React.Children.only expected to receive a single React element child.') : _prodInvariant('143') : void 0;
  return children;
}

module.exports = onlyChild;
}).call(this,require('_process'))
},{"./ReactElement":152,"./reactProdInvariant":166,"_process":171,"fbjs/lib/invariant":5}],166:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
'use strict';

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

function reactProdInvariant(code) {
  var argCount = arguments.length - 1;

  var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

  for (var argIdx = 0; argIdx < argCount; argIdx++) {
    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
  }

  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

  var error = new Error(message);
  error.name = 'Invariant Violation';
  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

  throw error;
}

module.exports = reactProdInvariant;
},{}],167:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');
var REACT_ELEMENT_TYPE = require('./ReactElementSymbol');

var getIteratorFn = require('./getIteratorFn');
var invariant = require('fbjs/lib/invariant');
var KeyEscapeUtils = require('./KeyEscapeUtils');
var warning = require('fbjs/lib/warning');

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * This is inlined from ReactElement since this file is shared between
 * isomorphic and renderers. We could extract this to a
 *
 */

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === 'object' && component.key != null) {
    // Explicit key
    return KeyEscapeUtils.escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' ||
  // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;
      if (iteratorFn !== children.entries) {
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          var mapsAsChildrenAddendum = '';
          if (ReactCurrentOwner.current) {
            var mapsAsChildrenOwnerName = ReactCurrentOwner.current.getName();
            if (mapsAsChildrenOwnerName) {
              mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
            }
          }
          process.env.NODE_ENV !== 'production' ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.%s', mapsAsChildrenAddendum) : void 0;
          didWarnAboutMaps = true;
        }
        // Iterator will provide entry [k,v] tuples rather than values.
        while (!(step = iterator.next()).done) {
          var entry = step.value;
          if (entry) {
            child = entry[1];
            nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        }
      }
    } else if (type === 'object') {
      var addendum = '';
      if (process.env.NODE_ENV !== 'production') {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
        if (children._isReactElement) {
          addendum = " It looks like you're using an element created by a different " + 'version of React. Make sure to use only one copy of React.';
        }
        if (ReactCurrentOwner.current) {
          var name = ReactCurrentOwner.current.getName();
          if (name) {
            addendum += ' Check the render method of `' + name + '`.';
          }
        }
      }
      var childrenString = String(children);
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : void 0;
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

module.exports = traverseAllChildren;
}).call(this,require('_process'))
},{"./KeyEscapeUtils":144,"./ReactCurrentOwner":150,"./ReactElementSymbol":153,"./getIteratorFn":163,"./reactProdInvariant":166,"_process":171,"fbjs/lib/invariant":5,"fbjs/lib/warning":6}],168:[function(require,module,exports){
'use strict';

module.exports = require('./lib/React');

},{"./lib/React":146}],169:[function(require,module,exports){
/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */

(function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else this[name] = definition()
})('$script', function () {
  var doc = document
    , head = doc.getElementsByTagName('head')[0]
    , s = 'string'
    , f = false
    , push = 'push'
    , readyState = 'readyState'
    , onreadystatechange = 'onreadystatechange'
    , list = {}
    , ids = {}
    , delay = {}
    , scripts = {}
    , scriptpath
    , urlArgs

  function every(ar, fn) {
    for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
    return 1
  }
  function each(ar, fn) {
    every(ar, function (el) {
      return !fn(el)
    })
  }

  function $script(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths]
    var idOrDoneIsDone = idOrDone && idOrDone.call
      , done = idOrDoneIsDone ? idOrDone : optDone
      , id = idOrDoneIsDone ? paths.join('') : idOrDone
      , queue = paths.length
    function loopFn(item) {
      return item.call ? item() : list[item]
    }
    function callback() {
      if (!--queue) {
        list[id] = 1
        done && done()
        for (var dset in delay) {
          every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
        }
      }
    }
    setTimeout(function () {
      each(paths, function loading(path, force) {
        if (path === null) return callback()
        
        if (!force && !/^https?:\/\//.test(path) && scriptpath) {
          path = (path.indexOf('.js') === -1) ? scriptpath + path + '.js' : scriptpath + path;
        }
        
        if (scripts[path]) {
          if (id) ids[id] = 1
          return (scripts[path] == 2) ? callback() : setTimeout(function () { loading(path, true) }, 0)
        }

        scripts[path] = 1
        if (id) ids[id] = 1
        create(path, callback)
      })
    }, 0)
    return $script
  }

  function create(path, fn) {
    var el = doc.createElement('script'), loaded
    el.onload = el.onerror = el[onreadystatechange] = function () {
      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
      el.onload = el[onreadystatechange] = null
      loaded = 1
      scripts[path] = 2
      fn()
    }
    el.async = 1
    el.src = urlArgs ? path + (path.indexOf('?') === -1 ? '?' : '&') + urlArgs : path;
    head.insertBefore(el, head.lastChild)
  }

  $script.get = create

  $script.order = function (scripts, id, done) {
    (function callback(s) {
      s = scripts.shift()
      !scripts.length ? $script(s, id, done) : $script(s, callback)
    }())
  }

  $script.path = function (p) {
    scriptpath = p
  }
  $script.urlArgs = function (str) {
    urlArgs = str;
  }
  $script.ready = function (deps, ready, req) {
    deps = deps[push] ? deps : [deps]
    var missing = [];
    !each(deps, function (dep) {
      list[dep] || missing[push](dep);
    }) && every(deps, function (dep) {return list[dep]}) ?
      ready() : !function (key) {
      delay[key] = delay[key] || []
      delay[key][push](ready)
      req && req(missing)
    }(deps.join('|'))
    return $script
  }

  $script.done = function (idOrDone) {
    $script([null], idOrDone)
  }

  return $script
});

},{}],170:[function(require,module,exports){
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const NAV_BAR_HEIGHT = 45;
const MIN_DESKTOP_WIDTH = 1100;

const SodaLogo = ({ height }) => {
	return React.createElement(
		"a",
		{ href: "#" },
		React.createElement("img", { src: "images/dot_slash_white.png", style: { height: height, position: "relative", right: 15 } })
	);
};

var ModifiedSodaLogo = React.createClass({
	displayName: "ModifiedSodaLogo",

	getInitialState: function () {
		return {
			width: 0,
			height: 0,
			left: 0,
			divElement: null
		};
	},

	render: function () {

		// LEAVE FUNCTIONS IN THIS FORM - ARROW (ANONYMOUS) FUNCTIONS CAUSE MEMORY LEAKS
		var onMouseOver = () => {
			this.props.updateRedMarker(this.state.divElement.clientWidth, this.state.divElement.offsetLeft);
		};
		var ref = input => {
			if (input != null) {
				this.state.divElement = input;
			}
		};

		return React.createElement("img", { src: "images/dot_slash_white.png", style: { height: this.props.height, position: "relative", right: 15 }, onClick: this.props.onClick, ref: ref, onMouseOver: onMouseOver, onMouseOut: this.props.onMouseOut });
	}
});

const BlackSodaLogo = ({ height }) => {
	return React.createElement("img", { src: "images/dot_slash_black.png", style: { height: height } });
};

var Card = React.createClass({
	displayName: "Card",

	render: function () {
		var cardStyle = _extends({
			WebkitFilter: "drop-shadow(0px 0px 5px #666)",
			filter: "drop-shadow(0px 5px 5px #666)"
		}, this.props.styling);
		return React.createElement(
			"div",
			{ style: cardStyle, onMouseOut: this.props.onMouseOut },
			this.props.children
		);
	}
});

var DesktopNavigationBarItemSubMenu = React.createClass({
	displayName: "DesktopNavigationBarItemSubMenu",

	render: function () {
		var subMenuStyle = {
			backgroundColor: "#FFF",
			color: "#000",
			display: "inline-block",
			height: "auto",
			fontFamily: "sans-serif",
			fontSize: 25,
			left: this.props.left,
			position: "relative",
			WebkitFilter: "drop-shadow(0px 0px 0px #666)",
			filter: "drop-shadow(0px 0px 0px #666)",
			fontSize: 22
		};
		return React.createElement(
			Card,
			{ styling: subMenuStyle, onMouseOut: this.props.onMouseOut },
			this.props.children
		);
	}
});

var ColorSwitchingButton = React.createClass({
	displayName: "ColorSwitchingButton",

	getInitialState: function () {
		return {
			color: "#000",
			backgroundColor: "#FFF"
		};
	},
	render: function () {
		return React.createElement(
			"div",
			{ style: _extends({}, this.props.style, { textDecoration: "none", backgroundColor: this.state.backgroundColor, color: this.state.color }), onMouseOver: () => this.setState({ color: "#FFF", backgroundColor: "#000" }), onMouseOut: () => this.setState({ color: "#000", backgroundColor: "#FFF" }) },
			React.createElement(
				"a",
				{ href: this.props.link, style: { textDecoration: "none", backgroundColor: this.state.backgroundColor, color: this.state.color } },
				this.props.children
			)
		);
	}
});

var DesktopNavigationBarItem = React.createClass({
	displayName: "DesktopNavigationBarItem",

	getInitialState: function () {
		return {
			width: 0,
			height: 0,
			left: 0,
			divElement: null
		};
	},
	textStyle: {
		color: "#FFF",
		fontSize: 25,
		textDecoration: "none",
		fontFamily: "sans-serif",
		fontWeight: "bold",
		display: "inline-block",
		verticalAlign: 11,
		position: "relative",
		paddingLeft: 15,
		paddingRight: 15
	},
	componentDidMount: function () {
		if (this.props.onScroll) window.addEventListener('scroll', this.handleScroll);
	},
	componentWillUnmount: function () {
		if (this.props.onScroll) window.removeEventListener('scroll', this.handleScroll);
	},
	handleScroll: function () {
		// this if condition helps minimize number of callbacks, without it, YUGE FPS drops will take place
		if (this.props.currentPage == this.props.targetPage && this.props.redMarker != this.state.divElement.offsetLeft + this.textStyle.paddingLeft) {
			this.props.onScroll(this.state.divElement.clientWidth - (this.textStyle.paddingLeft + this.textStyle.paddingRight), this.state.divElement.offsetLeft + this.textStyle.paddingLeft, this.props.targetPage);
		}
	},
	render: function () {
		var textStyle = {
			color: "#FFF",
			fontSize: 25,
			textDecoration: "none",
			fontFamily: "sans-serif",
			fontWeight: "bold",
			display: "inline-block",
			verticalAlign: 11,
			position: "relative",
			paddingLeft: 15,
			paddingRight: 15
		};
		// LEAVE FUNCTIONS IN THIS FORM - ARROW (ANONYMOUS) FUNCTIONS CAUSE MEMORY LEAKS
		var onMouseOver = () => {
			this.props.updateRedMarker(this.state.divElement.clientWidth - (textStyle.paddingLeft + textStyle.paddingRight), this.state.divElement.offsetLeft + textStyle.paddingLeft);
		};
		var ref = input => {
			if (input != null) {
				this.state.divElement = input;
			}
		};

		return React.createElement(
			"a",
			{ onClick: this.props.onClick, style: textStyle, href: this.props.link, ref: ref, onMouseOver: onMouseOver, onMouseOut: this.props.onMouseOut },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Bold" } },
				this.props.children
			)
		);
	}
});

var DesktopNavigationBar = React.createClass({
	displayName: "DesktopNavigationBar",

	getInitialState: function () {
		return {
			redMarkerWidth: 0,
			redMarkerLeft: 0,
			currentItemLeft: 0,
			currentItemWidth: 0,
			showRedMarker: false,
			showSubMenu: false,
			subMenuText: React.createElement("div", null)
		};
	},

	componentDidMount: function () {
		window.addEventListener("resize", this.removeRedMarker);
	},
	componentWillUnmount: function () {
		window.removeEventListener("resize", this.removeRedMarker);
	},
	removeRedMarker: function () {
		this.setState(_extends({}, this.state, { showRedMarker: false, showSubMenu: false }));
	},

	render: function () {
		var navigationBarStyle = {
			backgroundColor: "#000",
			width: this.props.width,
			height: this.props.height,
			padding: 10,
			display: "inline-block",
			textAlign: "center"
		};

		var redMarkerStyle = {
			backgroundColor: "#ff0000",
			width: this.state.redMarkerWidth,
			left: this.state.redMarkerLeft,
			position: "absolute",
			height: 15
		};
		const NavBarItemSubMenu = ({ left }) => {
			if (this.state.showSubMenu) {
				return React.createElement(
					DesktopNavigationBarItemSubMenu,
					{ left: left },
					this.state.subMenuText
				);
			} else {
				return null;
			}
		};
		const RedMarker = () => {
			if (this.state.showRedMarker) {
				return React.createElement("div", { style: redMarkerStyle });
			} else {
				return null;
			}
		};

		var props = {
			onClick: () => this.setState(_extends({}, this.state, { showRedMarker: true, redMarkerLeft: this.state.currentItemLeft, redMarkerWidth: this.state.currentItemWidth }))
		};
		var noSubMenuText = (width, left) => {
			this.setState(_extends({}, this.state, { currentItemWidth: width, currentItemLeft: left, showSubMenu: false }));
		};
		var onScroll = (width, left) => {
			this.setState(_extends({}, this.state, { currentItemWidth: width, currentItemLeft: left, showSubMenu: false, showRedMarker: true, redMarkerLeft: this.state.currentItemLeft, redMarkerWidth: this.state.currentItemWidth }));
		};
		var communitySubMenuText = (width, left) => {
			this.setState(_extends({}, this.state, { currentItemWidth: width, currentItemLeft: left, showSubMenu: true, subMenuText: React.createElement(
					ColorSwitchingButton,
					{ style: { fontFamily: "RopaSans-Regular", padding: 10 }, link: "#sunhacks" },
					"Sun Hacks 2017"
				)
			}));
		};
		var hackathonSubMenuText = (width, left) => {
			this.setState(_extends({}, this.state, { currentItemWidth: width, currentItemLeft: left, showSubMenu: true, subMenuText: React.createElement(
					"div",
					{ style: { fontFamily: "RopaSans-Regular" } },
					React.createElement(
						ColorSwitchingButton,
						{ style: { paddingTop: 5, padding: 10 }, link: "#group_projects" },
						"Group Projects"
					),
					React.createElement(
						ColorSwitchingButton,
						{ style: { paddingTop: 10, padding: 10 }, link: "#mentorship" },
						"Mentorship Program"
					),
					React.createElement(
						ColorSwitchingButton,
						{ style: { paddingBottom: 5, paddingTop: 10, padding: 10 }, link: "#distinguished" },
						"Distinguished SoDA membership"
					)
				) }));
		};
		var projectSubMenuText = (width, left) => {
			this.setState(_extends({}, this.state, { currentItemWidth: width, currentItemLeft: left, showSubMenu: true, subMenuText: React.createElement(
					"div",
					{ style: { fontFamily: "RopaSans-Regular" } },
					React.createElement(
						ColorSwitchingButton,
						{ style: { paddingTop: 5, padding: 10 }, link: "#officers" },
						"Officers"
					),
					React.createElement(
						ColorSwitchingButton,
						{ style: { paddingTop: 10, paddingBottom: 5, padding: 10 }, link: "#sponsors" },
						"Sponsors"
					)
				) }));
		};

		return React.createElement(
			"div",
			{ style: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }, onMouseLeave: () => this.setState(_extends({}, this.state, { showSubMenu: false })) },
			React.createElement(
				"div",
				{ style: navigationBarStyle },
				React.createElement(
					"a",
					{ href: "#home" },
					React.createElement(
						ModifiedSodaLogo,
						_extends({}, props, { updateRedMarker: noSubMenuText, height: NAV_BAR_HEIGHT }),
						"About"
					)
				),
				React.createElement(
					DesktopNavigationBarItem,
					_extends({ link: "#about" }, props, { updateRedMarker: noSubMenuText, onScroll: onScroll, currentPage: this.props.currentPage, targetPage: "about", redMarker: this.state.redMarkerLeft }),
					"About"
				),
				React.createElement(
					DesktopNavigationBarItem,
					_extends({ link: "#events" }, props, { updateRedMarker: noSubMenuText, onScroll: onScroll, currentPage: this.props.currentPage, targetPage: "events", redMarker: this.state.redMarkerLeft }),
					"Events"
				),
				React.createElement(
					DesktopNavigationBarItem,
					_extends({ link: "#careers" }, props, { updateRedMarker: noSubMenuText, onScroll: onScroll, currentPage: this.props.currentPage, targetPage: "careers", redMarker: this.state.redMarkerLeft }),
					"Careers"
				),
				React.createElement(
					DesktopNavigationBarItem,
					_extends({ link: "#hackathon" }, props, { updateRedMarker: communitySubMenuText, onScroll: onScroll, currentPage: this.props.currentPage, targetPage: "hackathon", redMarker: this.state.redMarkerLeft }),
					"Hackathon"
				),
				React.createElement(
					DesktopNavigationBarItem,
					_extends({ link: "#community" }, props, { updateRedMarker: hackathonSubMenuText, onScroll: onScroll, currentPage: this.props.currentPage, targetPage: "community", redMarker: this.state.redMarkerLeft }),
					"Community"
				),
				React.createElement(
					DesktopNavigationBarItem,
					_extends({ link: "#contacts" }, props, { updateRedMarker: projectSubMenuText, onScroll: onScroll, currentPage: this.props.currentPage, targetPage: "contact us", redMarker: this.state.redMarkerLeft }),
					"Contact Us"
				),
				React.createElement(
					"a",
					{ href: "https://sodaasu.slack.com", target: "_blank" },
					React.createElement("img", { src: "images/Chat_icon_white_tr.png", style: { height: NAV_BAR_HEIGHT - 10, left: 15, position: "relative" } })
				)
			),
			React.createElement(
				"div",
				{ style: { backgroundColor: "#0000ff", width: this.props.width, height: 15, WebkitFilter: "drop-shadow(0px 0px 5px #666)", filter: "drop-shadow(0px 5px 5px #666)" } },
				React.createElement(RedMarker, null),
				React.createElement(
					"div",
					null,
					React.createElement(NavBarItemSubMenu, { left: this.state.currentItemLeft })
				)
			)
		);
	}
});

var MobileNavigationBar = React.createClass({
	displayName: "MobileNavigationBar",

	getInitialState: function () {
		return {};
	},
	render: function () {
		var navigationBarStyle = {
			backgroundColor: "#000",
			width: this.props.width,
			height: this.props.height,
			position: "fixed",
			padding: 5
		};
		return React.createElement(
			"div",
			{ style: { position: "fixed", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 100 } },
			React.createElement(
				"div",
				{ style: navigationBarStyle },
				React.createElement(SodaLogo, { height: NAV_BAR_HEIGHT })
			)
		);
	}
});

var Palette = React.createClass({
	displayName: "Palette",

	render: function () {
		return React.createElement(
			"div",
			{ style: _extends({ display: "inline-block", margin: this.props.margin, verticalAlign: "top" }, this.props.styling) },
			React.createElement(
				"div",
				{ style: { textAlign: this.props.titleAlign } },
				React.createElement(
					Card,
					{ styling: { backgroundColor: this.props.titleBackgroundColor || "#000", color: this.props.titleColor || "#FFF", display: "inline-block", padding: 10, fontSize: this.props.fontSize || 30, fontFamily: "RopaSansPro-ExtraBold", position: "relative", bottom: -30, zIndex: 1, paddingLeft: 18, paddingRight: 18 } },
					this.props.title
				)
			),
			React.createElement(
				Card,
				{ styling: { backgroundColor: this.props.contentColor || "#F4F4F4", display: "inline-block", width: this.props.width, padding: 25, borderRadius: 10, textAlign: this.props.contentAlign } },
				React.createElement("br", null),
				this.props.children
			)
		);
	}
});

var DesktopWebsiteHeader = React.createClass({
	displayName: "DesktopWebsiteHeader",

	getInitialState: function () {
		return {
			markerColor: "#0000ff",
			currentItemWidth: 0,
			currentItemLeft: 0
		};
	},

	render: function () {
		var props = {
			onClick: () => {},
			onMouseOut: () => this.setState(_extends({}, this.state, { markerColor: "#0000ff" }))
		};
		var showRedMarker = () => {
			this.setState(_extends({}, this.state, { markerColor: "#ff0000" }));
		};
		var markerStyle = {
			backgroundColor: this.state.markerColor,
			width: 87,
			position: "absolute",
			height: 15,
			bottom: -15,
			WebkitFilter: "drop-shadow(0px 0px 10px #000)",
			filter: "drop-shadow(5px 5px 5px 5px #666)"
		};
		return React.createElement(
			"div",
			{ style: { backgroundColor: "#F6F3F4", height: this.props.height, maxWidth: this.props.width, top: NAV_BAR_HEIGHT + 35, position: "relative", padding: 40, textAlign: "center" } },
			React.createElement(
				"div",
				{ style: { textAlign: "left", display: "inline-block" } },
				React.createElement(BlackSodaLogo, { height: 150 }),
				React.createElement(
					"div",
					{ style: { fontSize: 40, fontFamily: "RopaSansPro-Medium" } },
					"The Software Developers Association"
				),
				React.createElement(
					"div",
					{ style: { fontSize: 40, fontFamily: "RopaSansPro-Light" } },
					"is the premiere software development club",
					React.createElement("br", null),
					"for university students."
				)
			)
		);
	}
});

var MobileWebsiteHeader = React.createClass({
	displayName: "MobileWebsiteHeader",

	getInitialState: function () {
		return {
			markerColor: "#0000ff",
			currentItemWidth: 0,
			currentItemLeft: 0
		};
	},

	render: function () {
		return React.createElement(
			"div",
			{ style: { backgroundColor: "#F6F3F4", height: this.props.height, maxWidth: this.props.width, top: NAV_BAR_HEIGHT, position: "relative", textAlign: "center", paddingTop: 40 } },
			React.createElement(
				"div",
				{ style: { textAlign: "left", display: "inline-block" } },
				React.createElement(BlackSodaLogo, { height: this.props.height / 2 }),
				React.createElement(
					"div",
					{ style: { fontSize: this.props.height / 8, fontFamily: "RopaSansPro-Medium" } },
					"The Software Developers Association"
				),
				React.createElement(
					"div",
					{ style: { fontSize: this.props.height / 8 - 5, fontFamily: "RopaSansPro-Light" } },
					"is the premiere software development club",
					React.createElement("br", null),
					"for university students."
				)
			)
		);
	}
});

const GoogleGetDirections = ({ link, size }) => {
	return React.createElement(
		"div",
		{ style: { display: "inline-block" } },
		React.createElement(
			"a",
			{ href: link, target: "_blank", style: { textDecoration: "none" } },
			React.createElement("img", { src: "images/google_map_icon.png", style: { height: size + 10 || 50, width: "auto", overflow: "hidden", paddingRight: 10 } })
		),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"Get directions."
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: link, target: "_blank" },
				"Google Maps"
			)
		)
	);
};

const GoogleForms = ({ link, size }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"a",
			{ href: link, target: "_blank", style: { textDecoration: "none" } },
			React.createElement("img", { src: "images/google_form_icon.png", style: { height: size + 10 || 50, width: "auto", paddingRight: 15 } })
		),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"RSVP Now."
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: link, target: "_blank" },
				"Google Forms"
			)
		)
	);
};

const FavoriteWebsite = ({}) => {
	return React.createElement(
		"div",
		null,
		React.createElement("img", { src: "images/black_star_icon.png", style: { height: 50, width: "auto", paddingRight: 15 } }),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 25 } },
				"Add our website to favorite."
			),
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: 18, color: "#808080" } },
				"Dialog from your browser"
			)
		)
	);
};

const FacebookPage = ({ size }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"a",
			{ href: "https://www.facebook.com/SoDAASU/", target: "_blank", style: { textDecoration: "none" } },
			React.createElement("img", { src: "images/facebook_icon.png", style: { height: size + 10 || 50, width: "auto", paddingRight: 15 } })
		),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"Follow our Facebook page."
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: "https://www.facebook.com/SoDAASU/", target: "_blank" },
				"facebook.com/SoDAASU/"
			)
		)
	);
};

const FacebookGroup = ({}) => {
	return React.createElement(
		"div",
		null,
		React.createElement("img", { src: "images/facebook.png", style: { height: 50, width: "auto", paddingRight: 15 } }),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 25 } },
				"Join our Facebook Group"
			),
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: 18, color: "#808080" } },
				"facebook.com/groups/asusoda"
			)
		)
	);
};

const GoogleCalendar = ({ size }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"a",
			{ href: "https://calendar.google.com/calendar/embed?src=cDNkcmR1azUzbGszaGxrdDVkcjA0bW91aTRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ", target: "_blank" },
			React.createElement("img", { src: "images/google_calendar_icon.png", style: { height: size + 10 || 50, width: "auto", paddingRight: 15 } })
		),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"View our monthly calendar."
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: "https://calendar.google.com/calendar/embed?src=cDNkcmR1azUzbGszaGxrdDVkcjA0bW91aTRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ", target: "_blank" },
				"Google Calendar"
			)
		)
	);
};

const NewsLetter = ({ size }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"a",
			{ href: "http://tinyurl.com/sodanews", target: "_blank" },
			React.createElement("img", { src: "images/newsletter_icon.png", style: { height: size + 10 || 50, width: "auto", paddingRight: 15 } })
		),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"Subscribe to our newsletter."
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: "http://tinyurl.com/sodanews", target: "_blank" },
				" tinyurl.com/sodanews"
			)
		)
	);
};

const TwitterPage = ({ size }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"a",
			{ href: "https://www.twitter.com/asu_soda", target: "_blank", style: { textDecoration: "none" } },
			React.createElement("img", { src: "images/twitter.png", style: { height: size + 10 || 50, width: "auto", paddingRight: 15 } })
		),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"Follow us on Twitter"
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: "https://www.twitter.com/asu_soda", target: "_blank" },
				"twitter.com/asu_soda"
			)
		)
	);
};

const InstagramPage = ({ size }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"a",
			{ href: "https://www.instagram.com/asu_soda/", target: "_blank", style: { textDecoration: "none" } },
			React.createElement("img", { src: "images/instagram_old.png", style: { height: size + 10 || 50, width: "auto", paddingRight: 15 } })
		),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"Follow us on Instagram"
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: "https://www.instagram.com/asu_soda/", target: "_blank" },
				"instagram.com/asu_soda/"
			)
		)
	);
};

const YoutubeChannel = ({ size }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"a",
			{ href: "https://www.youtube.com/sodaasu", target: "_blank", style: { textDecoration: "none" } },
			React.createElement("img", { src: "images/youtube.png", style: { height: size + 10 || 50, width: "auto", paddingRight: 15 } })
		),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"Subscribe to our Youtube Channel"
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: "https://www.youtube.com/sodaasu", target: "_blank" },
				"youtube.com/sodaasu"
			)
		)
	);
};

const SlackTeam = ({ size }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"a",
			{ href: "https://sodaasu.slack.com", target: "_blank" },
			React.createElement("img", { src: "images/slack.png", style: { height: size + 10 || 50, width: "auto", paddingRight: 15 } })
		),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"Join our Slack team"
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: "https://sodaasu.slack.com", target: "_blank" },
				"sodaasu.slack.com"
			)
		)
	);
};

const GithubProjects = ({ size }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"a",
			{ href: "https://www.github.com/asusoda", target: "_blank" },
			React.createElement("img", { src: "images/github_icon.png", style: { height: size + 10 || 50, width: "auto", paddingRight: 15 } })
		),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"See all SoDer's Projects on Github."
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: "https://www.github.com/asusoda", target: "_blank" },
				"github.com/asusoda"
			)
		)
	);
};

const OrgSync = ({ size }) => {
	return React.createElement(
		"div",
		null,
		React.createElement("img", { src: "", style: { height: size + 10 || 50, width: "auto", paddingRight: 10 } }),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"Register as a Soder on OrgSync."
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: "https://orgsync.com/12637/chapter", target: "_blank" },
				"orgsync.com/12637/chapter"
			)
		)
	);
};

const Wikipedia = ({}) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"a",
			{ href: "https://en.wikipedia.org/wiki/Hackathon", target: "_blank" },
			React.createElement("img", { src: "images/wikipedia_icon.png", style: { height: 45, width: "auto", paddingRight: 20 } })
		),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 25 } },
				"Learn more."
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: 18, color: "#808080", textDecoration: "none" }, href: "https://en.wikipedia.org/wiki/Hackathon", target: "_blank" },
				"Wikipedia"
			)
		)
	);
};

const SunHacks = ({ size }) => {
	return React.createElement(
		"div",
		null,
		React.createElement("img", { src: "", style: { height: size + 10 || 50, width: "auto", paddingRight: 20 } }),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: size / 2 || 25 } },
				"Sign up to be an organizer."
			),
			React.createElement(
				"a",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: size / 2.5 || 18, color: "#808080", textDecoration: "none" }, href: "http://bit.ly/sunhacks-form", target: "_blank" },
				"bit.ly/sunhacks-form"
			)
		)
	);
};

const LearnMore = ({}) => {
	return React.createElement(
		"div",
		null,
		React.createElement("img", { src: "", style: { height: 45, width: "auto", paddingRight: 20 } }),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 25 } },
				"Learn more."
			),
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: 18, color: "#808080" } },
				"whattheheck.io"
			)
		)
	);
};

const ReserveBus = ({}) => {
	return React.createElement(
		"div",
		null,
		React.createElement("img", { src: "", style: { height: 45, width: "auto", paddingRight: 20 } }),
		React.createElement(
			"div",
			{ style: { display: "inline-block", verticalAlign: 4 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 25 } },
				"Reserve a bus."
			),
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSans-Regular", fontSize: 18, color: "#808080" } },
				"Google Forms"
			)
		)
	);
};

var DesktopWebsiteAboutUs = React.createClass({
	displayName: "DesktopWebsiteAboutUs",

	getInitialState: function () {
		return {
			markerColor: "#0000ff",
			answerColor: "#0000ff",
			answerText: "Show answer",
			currentItemWidth: 0,
			currentItemLeft: 0,
			upcomingEvent: true,
			color: "#0000ff"
		};
	},

	render: function () {
		var width = this.props.width;
		var height = this.props.height;
		var props = {
			onClick: () => {},
			onMouseOut: () => this.setState(_extends({}, this.state, { markerColor: "#0000ff" }))
		};
		var showRedMarker = () => {
			this.setState(_extends({}, this.state, { markerColor: "#ff0000" }));
		};
		var markerStyle = {
			backgroundColor: this.state.markerColor,
			width: 93,
			position: "absolute",
			height: 15,
			bottom: -15,
			WebkitFilter: "drop-shadow(0px 0px 10px #000)",
			filter: "drop-shadow(5px 5px 5px 5px #666)"
		};

		let upcomingEvent = null;
		if (this.state.upcomingEvent) {
			upcomingEvent = React.createElement(
				Palette,
				{ title: "UPCOMING EVENTS", titleAlign: "left", contentAlign: "left", width: 400, margin: 40, styling: { display: "inline-block", position: "relative" } },
				React.createElement(
					"div",
					{ style: { textAlign: "right" } },
					React.createElement(
						"div",
						{ style: { position: "absolute", top: 60, left: 355, padding: 30, borderRadius: "0px 10px 0px 25px", backgroundColor: this.state.color, textAlign: "center", display: "inline-block", fontFamily: "RopaSansPro-Bold", color: "#FFF", fontSize: 20, zIndex: 2 }, onClick: () => this.setState(_extends({}, this.state, { upcomingEvent: false })),
							onMouseOver: () => this.setState(_extends({}, this.state, { color: "#ff0000" })), onMouseOut: () => this.setState(_extends({}, this.state, { color: "#0000ff" })) },
						"Next"
					)
				),
				React.createElement(
					"div",
					{ style: { position: "relative", top: 0 } },
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Light", fontSize: 45 } },
						"T-Shirts, ",
						React.createElement("br", null),
						"  Black Mirror, and Giveaways!"
					),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 30 } },
						"PSH 150",
						React.createElement("br", null),
						"Thursday, November 30th, 2017",
						React.createElement("br", null),
						"7:00 pm ~ 9:00 pm"
					),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Regular", fontSize: 24 } },
						"Join SoDA for our last meeting of the semester! In this meeting we will be handing out exclusive SoDA T-shirts as well as giving out raffle prizes! (Note: There will be a special giveaway for dis-tinguished members!). We will also be watching Black Mirror episodes to de-stress from all that finals studying! As always food will be provided, be sure to RSVP! "
					),
					React.createElement("br", null),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						React.createElement(GoogleGetDirections, { link: "https://goo.gl/maps/wCmYUWzcwh32" }),
						React.createElement(
							"div",
							{ style: { position: "relative", left: 10 } },
							React.createElement(GoogleForms, { link: "https://tinyurl.com/sodatshirt17" })
						)
					)
				)
			);
		} else {
			upcomingEvent = React.createElement(
				Palette,
				{ title: "UPCOMING EVENTS", titleAlign: "left", contentAlign: "left", width: 400, margin: 40, styling: { display: "inline-block", position: "relative" } },
				React.createElement(
					"div",
					{ style: { textAlign: "right" } },
					React.createElement(
						"div",
						{ style: { position: "absolute", top: 60, left: 357, padding: 30, borderRadius: "0px 10px 0px 25px", backgroundColor: this.state.color, textAlign: "center", display: "inline-block", fontFamily: "RopaSansPro-Bold", color: "#FFF", fontSize: 20, zIndex: 2 }, onClick: () => this.setState(_extends({}, this.state, { upcomingEvent: true })),
							onMouseOver: () => this.setState(_extends({}, this.state, { color: "#ff0000" })), onMouseOut: () => this.setState(_extends({}, this.state, { color: "#0000ff" })) },
						"Prev"
					)
				),
				React.createElement(
					"div",
					{ style: { position: "relative", top: 0 } },
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Light", fontSize: 50 } },
						"Resume ",
						React.createElement("br", null),
						" Workshop"
					),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 30 } },
						"PSH 150",
						React.createElement("br", null),
						"Thursday, November 16th, 2017",
						React.createElement("br", null),
						"7:00 pm ~ 9:00 pm"
					),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Regular", fontSize: 24 } },
						"Do you feel like your resume is dull and boring? Is your resume missing that extra wow factor that really impresses recruiters? If so this meeting is for you! We will go over the do's and don'ts to help polish that resume to a squeaky shine!"
					),
					React.createElement("br", null),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						React.createElement(GoogleGetDirections, { link: "https://goo.gl/maps/wCmYUWzcwh32" }),
						React.createElement(
							"div",
							{ style: { position: "relative", left: 10 } },
							React.createElement(GoogleForms, { link: "http://tinyurl.com/ResumeNov17" })
						)
					)
				)
			);
		}

		return React.createElement(
			"div",
			{ style: { width: width, overflow: "hidden", textAlign: "center", display: "inline-block", position: "relative", top: 80 } },
			React.createElement(
				"div",
				{ style: { position: "absolute", textAlign: "center", width: width } },
				React.createElement(
					"div",
					{ style: { display: "inline-block", width: 500 } },
					React.createElement(
						Palette,
						{ title: "NEW TO SoDA?", titleAlign: "left", contentAlign: "left", width: 400, styling: { zIndex: 10, position: "relative" }, margin: 40 },
						React.createElement(
							"div",
							{ style: { fontFamily: "RopaSansPro-Light", fontSize: 50 } },
							"Checklist."
						),
						React.createElement("br", null),
						React.createElement(FacebookPage, null),
						React.createElement("br", null),
						React.createElement(TwitterPage, null),
						React.createElement("br", null),
						React.createElement(InstagramPage, null),
						React.createElement("br", null),
						React.createElement(GoogleCalendar, null),
						React.createElement("br", null),
						React.createElement(SlackTeam, null),
						React.createElement("br", null),
						React.createElement(YoutubeChannel, null),
						React.createElement("br", null),
						React.createElement(GithubProjects, null),
						React.createElement("br", null),
						React.createElement(NewsLetter, null),
						React.createElement("br", null)
					),
					React.createElement(
						Palette,
						{ title: "DID YOU KNOW?", titleAlign: "left", contentAlign: "left", width: 400, margin: 40 },
						React.createElement("br", null),
						React.createElement(
							"div",
							{ style: { fontFamily: "RopaSans-Regular", fontSize: 24 } },
							"What is the only state in America that can be typed on one row of a traditional English QWERTY keyboard?"
						),
						React.createElement("br", null),
						React.createElement(
							"div",
							{ style: { textAlign: "right" } },
							React.createElement(
								"div",
								{ style: { backgroundColor: this.state.answerColor, display: "inline-block", width: 150, textAlign: "center", fontFamily: "RopaSansPro-Medium", fontSize: 25, color: "#FFF", padding: 5, paddingRight: 20, paddingLeft: 20, WebkitFilter: "drop-shadow(0px 0px 0px #666)", filter: "drop-shadow(0px 2px 5px #666)", position: "relative", right: 80 }, onMouseOver: () => this.setState(_extends({}, this.state, { answerColor: "#ff0000", answerText: "Alaska" })), onMouseOut: () => this.setState(_extends({}, this.state, { answerColor: "#0000ff", answerText: "Show answer" })) },
								this.state.answerText
							)
						)
					)
				),
				React.createElement(
					"div",
					{ style: { display: "inline-block", width: 500, verticalAlign: "top" } },
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						React.createElement(
							Palette,
							{ title: "UPCOMING HACKATHON", titleAlign: "left", contentAlign: "left", width: 400, margin: 40, styling: { display: "inline-block", position: "relative" } },
							React.createElement(
								"div",
								{ style: { position: "relative", top: 0 } },
								React.createElement(
									"div",
									{ style: { fontFamily: "RopaSansPro-Light", fontSize: 45 } },
									"Sundevil",
									React.createElement("br", null),
									"  Hacks!"
								),
								React.createElement("br", null),
								React.createElement(
									"div",
									{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 30 } },
									"PSH 150",
									React.createElement("br", null),
									"Thursday, November 30th, 2017",
									React.createElement("br", null),
									"7:00 pm ~ 9:00 pm"
								),
								React.createElement("br", null),
								React.createElement(
									"div",
									{ style: { fontFamily: "RopaSansPro-Regular", fontSize: 24 } },
									"Join SoDA for this amazing non existent hackathon that I am using as a placeholder until Mr. Vincent updates this palette. "
								),
								React.createElement("br", null),
								React.createElement("br", null),
								React.createElement(
									"div",
									{ style: { display: "inline-block" } },
									React.createElement(GoogleGetDirections, { link: "https://goo.gl/maps/wCmYUWzcwh32" }),
									React.createElement(
										"div",
										{ style: { position: "relative", left: 10 } },
										React.createElement(GoogleForms, { link: "https://tinyurl.com/sodatshirt17" })
									)
								)
							)
						)
					),
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						upcomingEvent
					)
				)
			),
			React.createElement(
				"div",
				null,
				React.createElement("img", { src: "images/geometry_white.jpg" }),
				React.createElement(
					"div",
					{ style: { position: "relative", top: -5, zIndex: -1, overflow: "hidden", height: 800 } },
					React.createElement("img", { src: "images/geometry_white_2.jpg" })
				)
			)
		);
	}
});

var MobileWebsiteAboutUs = React.createClass({
	displayName: "MobileWebsiteAboutUs",

	getInitialState: function () {
		return {
			markerColor: "#0000ff",
			answerColor: "#0000ff",
			answerText: "Show answer",
			currentItemWidth: 0,
			currentItemLeft: 0
		};
	},

	render: function () {
		var width = this.props.width;
		var height = this.props.height;
		var props = {
			onClick: () => {},
			onMouseOut: () => this.setState(_extends({}, this.state, { markerColor: "#0000ff" }))
		};
		var showRedMarker = () => {
			this.setState(_extends({}, this.state, { markerColor: "#ff0000" }));
		};
		var markerStyle = {
			backgroundColor: this.state.markerColor,
			width: 93,
			position: "absolute",
			height: 15,
			bottom: -15,
			WebkitFilter: "drop-shadow(0px 0px 10px #000)",
			filter: "drop-shadow(5px 5px 5px 5px #666)"
		};
		return React.createElement(
			"div",
			{ style: { width: width, overflow: "hidden", textAlign: "center", display: "inline-block", height: height } },
			React.createElement(
				"div",
				{ style: { position: "absolute", textAlign: "center", width: width } },
				React.createElement(
					"div",
					null,
					React.createElement(
						"div",
						{ style: { position: "relative", top: 50 } },
						React.createElement(
							Palette,
							{ title: "UPCOMING EVENTS", titleAlign: "left", contentAlign: "left", width: width / 2 + 50 < 400 ? width / 2 + 50 : 400, margin: 0, fontSize: width / 25 + 5 < 30 ? width / 25 + 5 : 30 },
							React.createElement(
								"div",
								{ style: { fontFamily: "RopaSansPro-Light", fontSize: width / 20 < 35 ? width / 20 : 35 } },
								"T-Shirts, Black Mirror, and Giveaways!"
							),
							React.createElement("br", null),
							React.createElement(
								"div",
								{ style: { fontFamily: "RopaSansPro-Medium", fontSize: width / 25 < 25 ? width / 25 : 25 } },
								"LSE 104",
								React.createElement("br", null),
								"Thursday, November 30th, 2017",
								React.createElement("br", null),
								"7:00 pm ~ 9:00 pm"
							),
							React.createElement("br", null),
							React.createElement(
								"div",
								{ style: { fontFamily: "RopaSansPro-Regular", fontSize: width / 30 + 2 < 20 ? width / 30 + 2 : 20 } },
								"Join SoDA for our last meeting of the semester! In this meeting we will be handing out exclusive SoDA T-shirts as well as giving out raffle prizes! (Note: There will be a special giveaway for dis-tinguished members!). We will also be watching Black Mirror episodes to de-stress from all that finals studying! As always food will be provided, be sure to RSVP! "
							),
							React.createElement("br", null),
							React.createElement(
								"div",
								{ style: { display: "inline-block" } },
								React.createElement(GoogleGetDirections, { link: "https://goo.gl/maps/JgQt7yMjBHS2", size: width / 15 < 35 ? width / 15 : 35 }),
								React.createElement(
									"div",
									{ style: { position: "relative", left: 10 } },
									React.createElement(GoogleForms, { link: "tinyurl.com/sodafinale-f17", size: width / 15 < 35 ? width / 15 : 35 })
								)
							)
						)
					),
					React.createElement(
						Palette,
						{ title: "NEW TO SoDA?", titleAlign: "left", contentAlign: "left", width: width / 2 + 50 < 400 ? width / 2 + 50 : 400, margin: 0, fontSize: width / 25 + 5 < 30 ? width / 25 + 5 : 30, styling: { top: 50, position: "relative" } },
						React.createElement(
							"div",
							{ style: { fontFamily: "RopaSansPro-Light", fontSize: width / 20 < 35 ? width / 20 : 35 } },
							"Checklist."
						),
						React.createElement("br", null),
						React.createElement(FacebookPage, { size: width / 15 < 45 ? width / 15 : 45 }),
						React.createElement(TwitterPage, { size: width / 15 < 45 ? width / 15 : 45 }),
						React.createElement(InstagramPage, { size: width / 15 < 45 ? width / 15 : 45 }),
						React.createElement(GoogleCalendar, { size: width / 15 < 45 ? width / 15 : 45 }),
						React.createElement(SlackTeam, { size: width / 15 < 45 ? width / 15 : 45 }),
						React.createElement(YoutubeChannel, { size: width / 15 < 45 ? width / 15 : 45 }),
						React.createElement(GithubProjects, { size: width / 15 < 45 ? width / 15 : 45 }),
						React.createElement(NewsLetter, { size: width / 15 < 45 ? width / 15 : 45 }),
						React.createElement(
							"div",
							{ style: { position: "relative", textAlign: "center" } },
							React.createElement(OrgSync, { size: width / 15 < 45 ? width / 15 : 45 })
						)
					),
					React.createElement(
						"div",
						null,
						React.createElement(
							Palette,
							{ title: "DID YOU KNOW?", titleAlign: "left", contentAlign: "left", width: width / 2 + 50 < 400 ? width / 2 + 50 : 400, margin: 0, fontSize: width / 25 + 5 < 30 ? width / 25 + 5 : 30, styling: { top: 50, position: "relative" } },
							React.createElement("br", null),
							React.createElement(
								"div",
								{ style: { fontFamily: "RopaSans-Regular", fontSize: width / 25 < 20 ? width / 25 : 20 } },
								"What is the only state in America that can be typed on one row of a traditional English QWERTY keyboard?"
							),
							React.createElement("br", null),
							React.createElement(
								"div",
								{ style: { textAlign: "center" } },
								React.createElement(
									"div",
									{ style: { backgroundColor: this.state.answerColor, display: "inline-block", width: 150, textAlign: "center", fontFamily: "RopaSansPro-Medium", fontSize: width / 25 < 25 ? width / 25 : 25, color: "#FFF", padding: 5, paddingRight: 20, paddingLeft: 20, WebkitFilter: "drop-shadow(0px 0px 0px #666)", filter: "drop-shadow(0px 2px 5px #666)" }, onMouseOver: () => this.setState(_extends({}, this.state, { answerColor: "#ff0000", answerText: "Alaska" })), onMouseOut: () => this.setState(_extends({}, this.state, { answerColor: "#0000ff", answerText: "Show answer" })) },
									this.state.answerText
								)
							)
						)
					)
				)
			),
			React.createElement("img", { src: "images/geometry_white.jpg", style: { height: height, width: "auto" } })
		);
	}
});

const AboutPage = ({ width, height }) => {
	return React.createElement(
		"div",
		{ style: { display: "inline-block", verticalAlign: "top", textAlign: "center" } },
		React.createElement(
			"div",
			{ style: { textAlign: "center" } },
			React.createElement(
				"div",
				null,
				React.createElement(
					Card,
					{ styling: { backgroundColor: "#000", color: "#FFF", display: "inline-block", padding: 10, fontSize: 50, fontFamily: "RopaSansPro-ExtraBold", position: "relative", bottom: -30, zIndex: 1, paddingLeft: 18, paddingRight: 18 } },
					"ABOUT US"
				)
			)
		),
		React.createElement(
			"div",
			{ style: { backgroundColor: "#F4F4F4", display: "inline-block", width: width, textAlign: "center" } },
			React.createElement("br", null),
			React.createElement(
				"div",
				{ style: { padding: 40, paddingLeft: 100, textAlign: "left", display: "inline-block" } },
				React.createElement(
					"div",
					null,
					React.createElement(BlackSodaLogo, { height: 180 }),
					React.createElement(
						"div",
						{ style: { fontSize: 90, fontWeight: "bold", display: "inline-block", verticalAlign: 45, position: "relative", fontFamily: "RopaSansPro-Bold" } },
						","
					)
				),
				React.createElement(
					"div",
					{ style: { position: "relative" } },
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-ExtraLightItalic", fontSize: 100 } },
						"a.k.a."
					),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 50 } },
						"The Software Developers Association,"
					),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Light", fontSize: 50 } },
						"is the premiere software development",
						React.createElement("br", null),
						" club for university students."
					)
				)
			)
		)
	);
};

const MobileAboutPage = ({ width, height }) => {
	return React.createElement(
		"div",
		{ style: { display: "inline-block", verticalAlign: "top", textAlign: "center" }, id: "about" },
		React.createElement(
			"div",
			{ style: { textAlign: "center" } },
			React.createElement(
				Card,
				{ styling: { backgroundColor: "#000", color: "#FFF", display: "inline-block", padding: 10, fontSize: width / 15 < 35 ? width / 15 : 35, fontFamily: "RopaSansPro-ExtraBold", position: "relative", bottom: -30, zIndex: 1, paddingLeft: 18, paddingRight: 18 } },
				"ABOUT US"
			)
		),
		React.createElement(
			"div",
			{ style: { backgroundColor: "#F4F4F4", display: "inline-block", width: width, textAlign: "center" } },
			React.createElement("br", null),
			React.createElement(
				"div",
				{ style: { padding: 40, textAlign: "center", display: "inline-block" } },
				React.createElement(
					"div",
					null,
					React.createElement(BlackSodaLogo, { height: width / 5 < 120 ? width / 5 : 120 })
				),
				React.createElement(
					"div",
					null,
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-ExtraLightItalic", fontSize: width / 10 < 70 ? width / 10 : 70 } },
						"a.k.a."
					),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Medium", fontSize: width / 14 < 50 ? width / 14 : 50, textAlign: "center" } },
						"The Software Developers Association,"
					),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Light", fontSize: width / 14 < 50 ? width / 14 : 50 } },
						"is the premiere software development",
						React.createElement("br", null),
						" club for university students."
					)
				)
			)
		)
	);
};

var EventPage = React.createClass({
	displayName: "EventPage",

	getInitialState: function () {
		return {
			markerColor: "#0000ff",
			answerColor: "#0000ff",
			answerText: "Show answer",
			currentItemWidth: 0,
			currentItemLeft: 0,
			upcomingEvent: true,
			color: "#0000ff"
		};
	},

	render: function () {
		var width = this.props.width;
		var height = this.props.height;
		var props = {
			onClick: () => {},
			onMouseOut: () => this.setState(_extends({}, this.state, { markerColor: "#0000ff" }))
		};
		var showRedMarker = () => {
			this.setState(_extends({}, this.state, { markerColor: "#ff0000" }));
		};
		var markerStyle = {
			backgroundColor: this.state.markerColor,
			width: 93,
			position: "absolute",
			height: 15,
			bottom: -15,
			WebkitFilter: "drop-shadow(0px 0px 10px #000)",
			filter: "drop-shadow(5px 5px 5px 5px #666)"
		};

		let upcomingEvent = null;
		if (this.state.upcomingEvent) {
			upcomingEvent = React.createElement(
				"div",
				{ style: { display: "inline-block", position: "relative" } },
				React.createElement(
					"div",
					{ style: { textAlign: "right" } },
					React.createElement(
						"div",
						{ style: { position: "absolute", top: 100, left: 394, padding: 30, borderRadius: "0px 10px 0px 25px", backgroundColor: this.state.color, textAlign: "center", display: "inline-block", fontFamily: "RopaSansPro-Bold", color: "#FFF", fontSize: 20, zIndex: 2 }, onClick: () => this.setState(_extends({}, this.state, { upcomingEvent: false })),
							onMouseOver: () => this.setState(_extends({}, this.state, { color: "#ff0000" })), onMouseOut: () => this.setState(_extends({}, this.state, { color: "#0000ff" })) },
						"Next"
					)
				),
				React.createElement(
					Palette,
					{ title: "EVENTS NEXT WEEK", titleAlign: "left", contentAlign: "left", width: 400, margin: 40 },
					React.createElement("div", { style: { fontFamily: "RopaSansPro-Light", fontSize: 50 } }),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 30 } },
						React.createElement("br", null),
						"No events until next semester",
						React.createElement("br", null)
					),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Regular", fontSize: 24 } },
						"If you want to learn more about SoDA and participate in upcoming events, click on the bubble icon in the title bar, it will take you to our official Slack page where you can communicate with officers."
					),
					React.createElement("br", null),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						React.createElement(GoogleGetDirections, { link: "https://goo.gl/maps/JBqwXncwYro" }),
						React.createElement(
							"div",
							{ style: { position: "relative", left: 10 } },
							React.createElement(GoogleForms, { link: "https://tinyurl.com/mentorship1117" })
						)
					)
				)
			);
		} else {
			upcomingEvent = React.createElement(
				"div",
				{ style: { display: "inline-block", position: "relative" } },
				React.createElement(
					"div",
					{ style: { textAlign: "right" } },
					React.createElement(
						"div",
						{ style: { position: "absolute", top: 100, left: 397, padding: 30, borderRadius: "0px 10px 0px 25px", backgroundColor: this.state.color, textAlign: "center", display: "inline-block", fontFamily: "RopaSansPro-Bold", color: "#FFF", fontSize: 20, zIndex: 2 }, onClick: () => this.setState(_extends({}, this.state, { upcomingEvent: true })),
							onMouseOver: () => this.setState(_extends({}, this.state, { color: "#ff0000" })), onMouseOut: () => this.setState(_extends({}, this.state, { color: "#0000ff" })) },
						"Prev"
					)
				),
				React.createElement(
					Palette,
					{ title: "EVENTS NEXT WEEK", titleAlign: "left", contentAlign: "left", width: 400, margin: 40 },
					React.createElement("div", { style: { fontFamily: "RopaSansPro-Light", fontSize: 50 } }),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 30 } },
						"Secret Event:"
					),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Regular", fontSize: 24 } },
						"Part at Lewis's House this friday!!!"
					),
					React.createElement("br", null),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						React.createElement(GoogleGetDirections, { link: "https://www.google.com/maps/place/Physical+Sciences+Center+F-Wing/@33.4208759,-111.9336383,17z/data=!3m1!4b1!4m5!3m4!1s0x872b08dc4ac6af5f:0x213722c63856da62!8m2!3d33.4208714!4d-111.9314496" }),
						React.createElement(
							"div",
							{ style: { position: "relative", left: 10 } },
							React.createElement(GoogleForms, { link: "https://docs.google.com/forms/d/e/1FAIpQLSdWI4Z5lwjRkhfBDE6RodJ_YP4FW3liWyFZJUCliEHnPU8W-w/viewform" })
						)
					)
				)
			);
		}

		return React.createElement(
			"div",
			{ style: { width: this.props.width, backgroundColor: "#F6F3F4", id: "events" } },
			React.createElement(
				"div",
				{ style: { padding: 40, paddingLeft: 40, paddingBottom: 80 } },
				React.createElement(
					"div",
					{ style: { fontSize: 150, fontFamily: "RopaSansPro-Thin" } },
					"Events."
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ style: { display: "inline-block", width: "100%" } },
					React.createElement(
						"div",
						{ style: { display: "inline-block", width: width / 2 - 100, float: "left" } },
						React.createElement(
							"div",
							{ style: { fontSize: 40, fontFamily: "RopaSansPro-Medium", color: "#808080" } },
							"SoDA has events and meetings at the ",
							React.createElement(
								"span",
								{ style: { color: "#000" } },
								"Physical Science building H wing (PSH),"
							),
							" room 150 unless otherwise stated."
						),
						React.createElement(
							"div",
							{ style: { position: "relative", top: 50 } },
							React.createElement(GoogleGetDirections, { link: "https://www.google.com/maps/place/Physical+Sciences+Center+F-Wing/@33.4208759,-111.9336383,17z/data=!3m1!4b1!4m5!3m4!1s0x872b08dc4ac6af5f:0x213722c63856da62!8m2!3d33.4208714!4d-111.9314496" })
						)
					),
					React.createElement(
						"div",
						{ style: { display: "inline-block", verticalAlign: "top", fontFamily: "RopaSansPro-Medium", width: width / 2 - 100, float: "right" } },
						React.createElement(
							"div",
							{ style: { fontSize: 40, color: "#808080", display: "inline-block" } },
							"Events and meetings ",
							React.createElement(
								"span",
								{ style: { color: "#000" } },
								"start at 7 pm and end at 9 pm"
							),
							" unless mentioned otherwise."
						),
						React.createElement(
							"div",
							{ style: { position: "relative", top: 50 } },
							React.createElement(GoogleCalendar, null)
						)
					)
				)
			),
			React.createElement(
				"div",
				{ style: { position: "absolute", textAlign: "center", width: width } },
				React.createElement(
					"div",
					{ style: { display: "inline-block" } },
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						upcomingEvent
					),
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						React.createElement(
							Palette,
							{ title: "SNEAK PEEK", titleAlign: "left", contentAlign: "left", width: 400, margin: 40 },
							React.createElement(
								"div",
								{ style: {} },
								React.createElement("iframe", { width: "400", height: "300", src: "https://www.youtube.com/embed/oyejM9R2w6U", frameBorder: "0", allowFullScreen: true })
							),
							React.createElement(
								"div",
								{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 30 } },
								"SoDA Social Fall 2016 Compilation"
							),
							React.createElement("br", null),
							React.createElement(
								"div",
								{ style: { fontFamily: "RopaSansPro-Regular", fontSize: 24 } },
								"It's always a good time. SoDers always have fun in this room. Watch our previous SoDA social event and see how SoDers get involved."
							),
							React.createElement("br", null),
							React.createElement(YoutubeChannel, null),
							React.createElement("br", null),
							React.createElement(
								"div",
								{ style: { fontFamily: "RopaSansPro-Regular", fontSize: 17 } },
								"Watch more events and hackathon videos from SoDA."
							)
						)
					)
				)
			),
			React.createElement("img", { src: "images/geometry_white.jpg", style: { width: width, overflow: "hidden", height: this.props.height } })
		);
	}
});

/*
//            return (
//            <div style={{width: width, backgroundColor: "#F6F3F4", id:"events"}}>
//                
//
//                <div style={{height: height, overflow: "hidden", textAlign: "center", display:"inline-block", position: "relative", top:80}}>
//                    <div style={{position: "absolute", textAlign: "center", width: width}}>
//                        <div style={{display: "inline-block"}}>
//                            
//                            <div style={{display: "inline-block"}}>
//                                <Palette title="EVENTS NEXT WEEK" titleAlign= "left" contentAlign= "left" width={400} margin={40}>
//                                    <div style={{fontFamily: "RopaSansPro-Light", fontSize: 50}}>Group Projects</div>
//                                    <br/>
//                                    <div style={{fontFamily: "RopaSansPro-Medium", fontSize: 30}}>PSH 150<br/>Thursday, October 12th, 2017<br/>7:00 pm ~ 9:00 pm</div>
//                                    <br/>
//                                    <div style={{fontFamily: "RopaSansPro-Regular", fontSize: 24}}> </div>
//                                    <br/>
//                                    <br/>
//                                    <div style={{display: "inline-block"}}>
//                                        <GoogleGetDirections link="https://www.google.com/maps/place/Physical+Sciences+Center+F-Wing/@33.4208759,-111.9336383,17z/data=!3m1!4b1!4m5!3m4!1s0x872b08dc4ac6af5f:0x213722c63856da62!8m2!3d33.4208714!4d-111.9314496"/>
//                                        <div style={{position: "relative", left: 10}}>
//                                            <GoogleForms link="https://docs.google.com/forms/d/e/1FAIpQLSdWI4Z5lwjRkhfBDE6RodJ_YP4FW3liWyFZJUCliEHnPU8W-w/viewform"/>
//                                        </div>
//                                    </div>
//
//                                </Palette>
//                            </div>
//
//                            <div style={{display: "inline-block"}}>
//                                <Palette title="SNEAK PEEK" titleAlign= "left" contentAlign= "left" width={400} margin={40}>
//                                    <div style={{}}>
//                                        <iframe width="400" height="300" src="https://www.youtube.com/embed/oyejM9R2w6U" frameBorder="0" allowFullScreen></iframe>
//                                    </div>
//                                    <div style={{fontFamily: "RopaSansPro-Medium", fontSize: 30}}>SoDA Social Fall 2016 Compilation</div>
//                                    <br/>
//                                    <div style={{fontFamily: "RopaSansPro-Regular", fontSize: 24}}>It&apos;s always a good time. SoDers always have fun in this room. Watch our previous SoDA social event and see how SoDers get involved.</div>
//                                    <br/>
//                                    <YoutubeChannel/>
//                                    <br/>
//                                    <div style={{fontFamily: "RopaSansPro-Regular", fontSize: 17}}>Watch more events and hackathon videos from SoDA.</div>
//                                </Palette>
//                            </div>
//                        </div>
//                    </div>
//                    <img src="images/asu_geometry_soda_white.jpg" style={{width: width, overflow: "hidden", height: height}}/>
//                </div>
//            </div>);
*/

const MobileEventPage = ({ width, height }) => {
	return React.createElement(
		"div",
		{ style: { width: width, backgroundColor: "#F6F3F4", id: "events", height: height } },
		React.createElement(
			"div",
			{ style: { padding: 40, paddingLeft: 40 } },
			React.createElement(
				"div",
				{ style: { fontSize: width / 5 < 100 ? width / 5 : 100, fontFamily: "RopaSansPro-Thin" } },
				"Events."
			),
			React.createElement("br", null),
			React.createElement(
				"div",
				{ style: { display: "inline-block", width: "100%" } },
				React.createElement(
					"div",
					{ style: {} },
					React.createElement(
						"div",
						{ style: { fontSize: width / 20 < 30 ? width / 20 : 30, fontFamily: "RopaSansPro-Medium", color: "#808080" } },
						"SoDA has events and meetings at the ",
						React.createElement(
							"span",
							{ style: { color: "#000" } },
							"Physical Science building H wing (PSH),"
						),
						" room 150 unless otherwise stated."
					),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { position: "relative" } },
						React.createElement(GoogleGetDirections, { link: "https://www.google.com/maps/place/Physical+Sciences+Center+F-Wing/@33.4208759,-111.9336383,17z/data=!3m1!4b1!4m5!3m4!1s0x872b08dc4ac6af5f:0x213722c63856da62!8m2!3d33.4208714!4d-111.9314496", size: width / 12 < 35 ? width / 12 : 35 })
					)
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ style: { fontFamily: "RopaSansPro-Medium" } },
					React.createElement(
						"div",
						{ style: { fontSize: width / 20 < 30 ? width / 20 : 30, color: "#808080", display: "inline-block" } },
						"Events and meetings ",
						React.createElement(
							"span",
							{ style: { color: "#000" } },
							"start at 7 pm and end at 9 pm"
						),
						" unless mentioned otherwise."
					),
					React.createElement(
						"div",
						{ style: { position: "relative", top: 15 } },
						React.createElement(GoogleCalendar, { size: width / 12 < 35 ? width / 12 : 35 })
					)
				)
			)
		),
		React.createElement(
			"div",
			{ style: { height: height, overflow: "hidden", textAlign: "center", display: "inline-block", position: "relative", top: 80 } },
			React.createElement(
				"div",
				{ style: { position: "absolute", textAlign: "center", width: width } },
				React.createElement(
					"div",
					{ style: { display: "inline-block" } },
					React.createElement(
						"div",
						null,
						React.createElement(
							Palette,
							{ title: "EVENTS NEXT WEEK", titleAlign: "left", contentAlign: "left", width: width / 2 + 50 < 400 ? width / 2 + 50 : 400, margin: 0, fontSize: width / 25 + 5 < 30 ? width / 25 + 5 : 30 },
							React.createElement("div", { style: { fontFamily: "RopaSansPro-Light", fontSize: width / 20 < 35 ? width / 20 : 35 } }),
							React.createElement("br", null),
							React.createElement(
								"div",
								{ style: { fontFamily: "RopaSansPro-Medium", fontSize: width / 25 < 25 ? width / 25 : 25 } },
								"   ",
								React.createElement("br", null),
								React.createElement("br", null)
							),
							React.createElement("br", null),
							React.createElement("div", { style: { fontFamily: "RopaSansPro-Regular", fontSize: width / 30 + 2 < 20 ? width / 30 + 2 : 20 } }),
							React.createElement("br", null),
							React.createElement(
								"div",
								{ style: { display: "inline-block" } },
								React.createElement(GoogleGetDirections, { link: "https://goo.gl/maps/NQXH4Fin8sT2", size: width / 15 < 35 ? width / 15 : 35 }),
								React.createElement(
									"div",
									{ style: { position: "relative", left: 10 } },
									React.createElement(GoogleForms, { link: "https://docs.google.com/forms/d/e/1FAIpQLSc8vrhnO1pEMuHKkIcTt6DoAXbNTBmZjbwAlYrc3iJgaS4eiQ/viewform", size: width / 15 < 35 ? width / 15 : 35 })
								)
							)
						)
					),
					React.createElement(
						"div",
						null,
						React.createElement(
							Palette,
							{ title: "SNEAK PEEK", titleAlign: "left", contentAlign: "left", width: width / 2 + 50 < 400 ? width / 2 + 50 : 400, margin: 0, fontSize: width / 25 + 5 < 30 ? width / 25 + 5 : 30 },
							React.createElement(
								"div",
								{ style: {} },
								React.createElement("iframe", { width: width / 1.7 < 400 ? width / 1.7 : 400, height: width / 2.5 < 300 ? width / 2.5 : 300, src: "https://www.youtube.com/embed/oyejM9R2w6U", frameBorder: "0", allowFullScreen: true })
							),
							React.createElement(
								"div",
								{ style: { fontFamily: "RopaSansPro-Medium", fontSize: width / 25 < 30 ? width / 25 : 30 } },
								"SoDA Social Fall 2016 Compilation"
							),
							React.createElement("br", null),
							React.createElement(
								"div",
								{ style: { fontFamily: "RopaSansPro-Regular", fontSize: width / 30 + 2 < 20 ? width / 30 + 2 : 20 } },
								"It's always a good time. SoDers always have fun in this room. Watch our previous SoDA social event and see how SoDers get involved."
							),
							React.createElement("br", null),
							React.createElement(YoutubeChannel, { size: width / 15 < 35 ? width / 15 : 35 }),
							React.createElement("br", null),
							React.createElement(
								"div",
								{ style: { fontFamily: "RopaSansPro-Regular", fontSize: width / 35 < 17 ? width / 35 : 17 } },
								"Watch more events and hackathon videos from SoDA."
							)
						)
					)
				)
			),
			React.createElement("img", { src: "images/asu_geometry_soda_white.jpg", style: { width: width, overflow: "hidden", height: height } })
		)
	);
};

const CareersPage = ({ width, height }) => {
	return React.createElement(
		"div",
		{ style: { textAlign: "center" } },
		React.createElement(
			"div",
			{ style: { width: width, backgroundColor: "#F6F3F4", id: "careers", paddingBottom: 40, textAlign: "left" } },
			React.createElement(
				"div",
				{ style: { padding: 40, paddingLeft: 40 } },
				React.createElement(
					"div",
					{ style: { fontSize: 150, fontFamily: "RopaSansPro-Thin" } },
					"Careers."
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ style: { display: "inline-block", width: "100%" } },
					React.createElement(
						"div",
						null,
						React.createElement(
							"div",
							{ style: { fontSize: 40, fontFamily: "RopaSansPro-Regular", color: "#808080" } },
							"One thing that is deeply rooted is SoDA is helping its fellow members get their foot in the door with industry. We want students to become familiar with industry by helping them prepare for technical interview, and showing them how and when to apply. Students who think and prepare sooner have a much easier time landing a job, and are much more successful during the job hunt itself."
						)
					)
				)
			)
		),
		React.createElement("br", null),
		React.createElement("br", null),
		React.createElement(
			"div",
			{ style: { display: "inline-block" }, id: "sunhacks" },
			React.createElement(
				Card,
				{ styling: { backgroundColor: "#F4F4F4", textAlign: "left", width: 800, padding: 25, borderRadius: 10 } },
				React.createElement("div", { style: { fontFamily: "RopaSansPro-Light", fontSize: 50 } }),
				React.createElement(
					"div",
					{ style: { fontFamily: "RopaSansPro-Regular" } },
					React.createElement(
						"div",
						{ style: { fontSize: 25, display: "inline-block" } },
						"SoDA has a few ways it plan to execute this goal. First are mock interviews. Mock interviews are one of the greatest ways to understand how companies test candidates before they hire. It gives you a chance to be put in that very important setting without all the pressure. You are able to understand what and how you will be tested, improving your chances to pass your interview. Next are the SoDA initiatives we put together. One of the strongest initiatives we've devised to help meet our goal are group projects. This gives students a chance to work on a technical team, much like the one they would work on at an internship and full time, and produce a viable product! This increases the technical skill set of the candidate all while improving their resume. ",
						React.createElement("br", null),
						"All in all SoDA is here for you and your career questions/concerns."
					),
					React.createElement("br", null),
					React.createElement("br", null),
					React.createElement(
						"div",
						null,
						React.createElement(GoogleCalendar, null)
					)
				)
			)
		),
		React.createElement(
			"div",
			{ style: { textAlign: "center", height: 150 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Regular", fontSize: 50, marginTop: 40 } },
				"More coming soon..."
			)
		)
	);
};

const MobileCareersPage = ({ width, height }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"div",
			{ style: { width: width, backgroundColor: "#F6F3F4", id: "careers", paddingBottom: 40 } },
			React.createElement(
				"div",
				{ style: { padding: 40, paddingLeft: 40 } },
				React.createElement(
					"div",
					{ style: { fontSize: width / 5 < 100 ? width / 5 : 100, fontFamily: "RopaSansPro-Thin" } },
					"Careers."
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ style: { display: "inline-block", width: "100%" } },
					React.createElement(
						"div",
						{ style: {} },
						React.createElement(
							"div",
							{ style: { fontSize: width / 20 < 25 ? width / 20 : 25, fontFamily: "RopaSansPro-Light", color: "#000" } },
							"One thing that is deeply rooted is SoDA is helping its fellow members get their foot in the door with industry. We want students to become familiar with industry by helping them prepare for technical interview, and showing them how and when to apply. Students who think and prepare sooner have a much easier time landing a job, and are much more successful during the job hunt itself."
						),
						React.createElement("br", null)
					),
					React.createElement("br", null),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Light" } },
						React.createElement(
							"div",
							{ style: { fontSize: width / 20 < 25 ? width / 20 : 25, color: "#000", display: "inline-block" } },
							"SoDA has a few ways it plan to execute this goal. First are mock interviews. Mock interviews are one of the greatest ways to understand how companies test candidates before they hire. It gives you a chance to be put in that very important setting without all the pressure. You are able to understand what and how you will be tested, improving your chances to pass your interview. Next are the SoDA initiatives we put together. One of the strongest initiatives we've devised to help meet our goal are group projects. This gives students a chance to work on a technical team, much like the one they would work on at an internship and full time, and produce a viable product! This increases the technical skill set of the candidate all while improving their resume. ",
							React.createElement("br", null),
							React.createElement("br", null),
							"All in all SoDA is here for you and your career questions/concerns."
						),
						React.createElement(
							"div",
							{ style: { position: "relative", top: 15 } },
							React.createElement(GoogleCalendar, { size: width / 12 < 35 ? width / 12 : 35 })
						)
					)
				)
			)
		),
		React.createElement(
			"div",
			{ style: { textAlign: "center", height: 150 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Regular", fontSize: width / 10 < 50 ? width / 10 : 50, marginTop: 40 } },
				"Coming soon..."
			)
		)
	);
};

const HackathonPage = ({ width, height }) => {
	return React.createElement(
		"div",
		{ style: { height: height } },
		React.createElement(
			"div",
			{ style: { width: width, backgroundColor: "#F6F3F4", id: "hackathon" } },
			React.createElement(
				"div",
				{ style: { padding: 40, paddingLeft: 40 } },
				React.createElement(
					"div",
					{ style: { fontSize: 150, fontFamily: "RopaSansPro-Thin" } },
					"Hackathon."
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ style: { display: "inline-block", width: "100%" } },
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						React.createElement(
							"div",
							{ style: { fontSize: 40, fontFamily: "RopaSansPro-Regular", color: "#808080" } },
							"A ",
							React.createElement(
								"span",
								{ style: { color: "#000" } },
								"hackathon"
							),
							" is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including subject-matter-experts, collaborate intensively on software projects."
						)
					),
					React.createElement(
						"div",
						{ style: { display: "inline-block", width: "100%", position: "relative", top: 30 } },
						React.createElement(
							"div",
							{ style: { float: "left", position: "relative", left: 200 } },
							React.createElement(Wikipedia, null)
						),
						React.createElement(
							"div",
							{ style: { float: "right", position: "relative", right: 200 } },
							React.createElement(GoogleCalendar, null)
						)
					)
				)
			)
		),
		React.createElement(
			"div",
			{ style: { padding: 20, textAlign: "center" } },
			React.createElement(
				Card,
				{ styling: { backgroundColor: "#000", height: 60, textAlign: "center", width: 550, display: "inline-block", margin: 20 } },
				React.createElement(
					"b",
					{ style: { color: "#FFF", fontSize: 45, lineHeight: "60px", fontFamily: "RopaSansPro-Extrabold" } },
					"UPCOMING HACKATHONS"
				)
			),
			React.createElement(
				"div",
				{ style: { color: "#000", fontSize: 30, fontFamily: "RopaSansPro-Medium" } },
				"in Arizona, 2017~2018 academic year"
			),
			React.createElement("br", null),
			React.createElement(
				"div",
				{ style: { display: "inline-block" }, id: "sunhacks" },
				React.createElement(
					Palette,
					{ title: "Sun Hacks", titleAlign: "left", contentAlign: "left", width: 800 },
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Light", fontSize: 50 } },
						"Sun Hacks Hackathon"
					),
					React.createElement("br", null),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Regular", fontSize: 24 } },
						"Have you ever wanted to get more involved in the tech community and work personally with some of the top tech companies in the nation such as Amazon, Google, and Uber (just to name off a few of our partners from last year)? Well you can by becoming an organizer for SunHacks! Sunhacks is a collaboration of DesertHacks, SWHacks, and Emergentech to create one of the largest hackathons in the nation at ASU. Hackathons in short are magical events where students can learn about the latest things in the world of technology, network with top tech companies, and build amazing projects. This bold vision will require a significant amount of human capital. We are currently looking for people that are passionate about technology to help organize such a large event. There is no experience required and every major is allowed to apply! Fill out this ",
						React.createElement(
							"a",
							{ href: "https://goo.gl/forms/AhHEp8PLJ54FqN3n2", style: { textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000" }, target: "_blank" },
							"form"
						),
						" if you are interested and we will be in touch!"
					),
					React.createElement("br", null),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						React.createElement(SunHacks, null)
					)
				)
			),
			React.createElement(
				"div",
				{ style: { textAlign: "center", height: 150 } },
				React.createElement(
					"div",
					{ style: { fontFamily: "RopaSansPro-Regular", fontSize: 50, marginTop: 40 } },
					"More coming soon..."
				)
			)
		)
	);
};

const MobileHackathonPage = ({ width, height }) => {
	return React.createElement(
		"div",
		{ style: { height: height } },
		React.createElement(
			"div",
			{ style: { width: width, backgroundColor: "#F6F3F4", id: "careers", paddingBottom: 40 } },
			React.createElement(
				"div",
				{ style: { padding: 40, paddingLeft: 40 } },
				React.createElement(
					"div",
					{ style: { fontSize: width / 5 < 100 ? width / 5 : 100, fontFamily: "RopaSansPro-Thin" } },
					"Hackathon."
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ style: { display: "inline-block", width: "100%" } },
					React.createElement(
						"div",
						{ style: {} },
						React.createElement(
							"div",
							{ style: { fontSize: width / 20 < 25 ? width / 20 : 25, fontFamily: "RopaSansPro-Light", color: "#000" } },
							"A hackathon is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including subject-matter-experts, collaborate intensively on software projects."
						),
						React.createElement("br", null)
					),
					React.createElement(
						"div",
						{ style: { position: "relative", top: 15 } },
						React.createElement(GoogleCalendar, { size: width / 12 < 35 ? width / 12 : 35 })
					)
				)
			)
		),
		React.createElement(
			"div",
			{ style: { padding: 20, textAlign: "center" } },
			React.createElement(
				"div",
				{ style: { backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, paddingLeft: 20, paddingRight: 20 } },
				React.createElement(
					"b",
					{ style: { color: "#FFF", fontSize: width / 20 < 35 ? width / 20 : 35, lineHeight: "60px", fontFamily: "RopaSansPro-Extrabold" } },
					"UPCOMING HACKATHONS"
				)
			),
			React.createElement(
				"div",
				{ style: { color: "#000", fontSize: width / 20 < 30 ? width / 20 : 30, fontFamily: "RopaSansPro-Medium" } },
				"in Arizona, 2017~2018 academic year"
			),
			React.createElement("br", null),
			React.createElement(
				"div",
				{ style: { display: "inline-block" }, id: "sunhacks" },
				React.createElement(
					Palette,
					{ title: "Sun Hacks", titleAlign: "left", contentAlign: "left", width: width - 100 < 700 ? width - 100 : 700 },
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Light", fontSize: width / 11 < 45 ? width / 11 : 45 } },
						"Sun Hacks Hackathon"
					),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Light", fontSize: width / 25 < 24 ? width / 25 : 24 } },
						"Have you ever wanted to get more involved in the tech community and work personally with some of the top tech companies in the nation such as Amazon, Google, and Uber (just to name off a few of our partners from last year)? Well you can by becoming an organizer for SunHacks! Sunhacks is a collaboration of DesertHacks, SWHacks, and Emergentech to create one of the largest hackathons in the nation at ASU. Hackathons in short are magical events where students can learn about the latest things in the world of technology, network with top tech companies, and build amazing projects. This bold vision will require a significant amount of human capital. We are currently looking for people that are passionate about technology to help organize such a large event. There is no experience required and every major is allowed to apply! Fill out this ",
						React.createElement(
							"a",
							{ href: "https://goo.gl/forms/AhHEp8PLJ54FqN3n2", style: { textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000" }, target: "_blank" },
							"form"
						),
						" if you are interested and we will be in touch!"
					),
					React.createElement("br", null),
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						React.createElement(SunHacks, { size: width / 12 < 45 ? width / 12 : 45 })
					)
				)
			),
			React.createElement(
				"div",
				{ style: { textAlign: "center", height: 150 } },
				React.createElement(
					"div",
					{ style: { fontFamily: "RopaSansPro-Regular", fontSize: width / 10 < 50 ? width / 10 : 50, marginTop: 40 } },
					"More coming soon..."
				)
			)
		)
	);
};

/*
			<div style={{position: "relative", top: 50}}>
				<Card styling={{backgroundColor: "#FFF", padding: 30, textAlign: "left", display: "inline-block", borderRadius: 10}}>
					<div style={{fontSize: 100, fontFamily: "RopaSansPro-Light"}}><span style={{fontFamily: "RopaSansPro-ExtraBold"}}>WTH</span>ecks</div>
					<div style={{fontSize: 50, fontFamily: "RopaSansPro-Light", position: "relative", top: -30}}>2017</div>
					<div style={{fontSize: 300, fontFamily: "RopaSansPro-Light", position: "absolute", textAlign: "center", color: "#E4E4E4", zIndex: -1, top: -60, marginLeft: 50}}>W</div>
					<div style={{textAlign: "center", fontSize: 25}}>
						<div style={{fontFamily: "RopaSansPro-Bold"}}>September 8~10, 2017</div>
						<div style={{fontFamily: "RopaSansPro-Regular"}}>What University<br/>Surprise, AZ</div>
					</div>
					<br/>
					<LearnMore/>
					<br/>
					<ReserveBus/>
				</Card>
					<Card styling={{backgroundColor: "#FFF", padding: 30, textAlign: "left", display: "inline-block", borderRadius: 10, verticalAlign: "top", marginLeft: 130, height: 475}}>
					<div style={{color: "#E4E4E4", fontSize: 100, fontFamily: "RopaSansPro-Medium", textAlign: "center"}}>coLd</div>
					<div style={{fontSize: 100, position: "relative", top: -50, fontFamily: "RopaSansPro-Medium"}}>coco 2017</div>
					<div style={{color: "#E4E4E4", fontSize: 100, position: "relative", top: -90, fontFamily: "RopaSansPro-Medium", textAlign: "center"}}>codE</div>
					<div style={{position: "relative", top: -100}}>
						<div style={{textAlign: "center", fontSize: 25}}>
							<div style={{fontFamily: "RopaSansPro-Bold"}}>September 8~10, 2017</div>
							<div style={{fontFamily: "RopaSansPro-Regular"}}>Cool University<br/>Glendale, AZ</div>
						</div>
						<br/>
						<LearnMore/>
					</div>
				</Card>
				<br/>
			</div>
*/

const MembershipCard = ({ title, name, email, link }) => {
	return React.createElement(
		"a",
		{ target: "_blank", style: { textDecoration: "none", color: "#000" }, href: link },
		React.createElement(
			Card,
			{ styling: { backgroundColor: "#F6F3F4", width: 500, textAlign: "left", borderRadius: 10, padding: 20, margin: 40, display: "inline-block", marginBottom: 20 } },
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansSCPro-Regular", fontSize: 25 } },
				title
			),
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Medium", fontSize: 40 } },
				name
			),
			React.createElement(
				"div",
				{ style: { fontFamily: "RopaSansPro-Regular", fontSize: 25 } },
				email
			)
		)
	);
};

const MobileMembershipCard = ({ title, name, email, width }) => {
	return React.createElement(
		Card,
		{ styling: { backgroundColor: "#F6F3F4", width: (width - 100 < 500 ? width - 100 : 500) || 500, textAlign: "left", borderRadius: 10, padding: 20, display: "inline-block", marginBottom: 40 } },
		React.createElement(
			"div",
			{ style: { fontFamily: "RopaSansSCPro-Regular", fontSize: width / 20 < 25 ? width / 20 : 25 } },
			title
		),
		React.createElement(
			"div",
			{ style: { fontFamily: "RopaSansSCPro-Bold", fontSize: width / 20 < 25 ? width / 20 : 25 } },
			name
		),
		React.createElement(
			"div",
			{ style: { fontFamily: "RopaSansPro-Regular", fontSize: width / 20 < 25 ? width / 20 : 25 } },
			email
		)
	);
};

const CommunityPage = ({ width, height }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"div",
			{ style: { width: width, backgroundColor: "#F6F3F4", id: "hackathon" } },
			React.createElement(
				"div",
				{ style: { padding: 40, paddingLeft: 40 } },
				React.createElement(
					"div",
					{ style: { fontSize: 150, fontFamily: "RopaSansPro-Thin" } },
					"Community."
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ style: { display: "inline-block", width: "100%" } },
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						React.createElement(
							"div",
							{ style: { fontSize: 40, fontFamily: "RopaSansPro-Medium", color: "#808080" } },
							" One of SoDA's missions is to foster a sense of community and create a support network within its members. This year we are introducing the Group Projects initiative, Mentorship Program, and Distinguished SoDA membership. They all align with the goals of providing further career development opportunities for our members and encourage more familiarity and collaboration within the club."
						)
					)
				)
			)
		),
		React.createElement(
			"div",
			{ style: { padding: 20, textAlign: "center" } },
			React.createElement("div", { id: "group_projects" }),
			React.createElement(
				Card,
				{ styling: { backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, padding: 10, paddingLeft: 25, paddingRight: 25 } },
				React.createElement(
					"b",
					{ style: { color: "#FFF", fontSize: 45, lineHeight: "60px", fontFamily: "RopaSansPro-Extrabold" } },
					"Group Projects"
				)
			),
			React.createElement(
				"div",
				null,
				React.createElement(
					"div",
					{ style: { position: "relative", textAlign: "center", display: "inline-block" } },
					React.createElement(
						"div",
						{ style: { fontSize: 25, fontFamily: "RopaSansPro-Regular", textAlign: "left", padding: 50, paddingTop: 25, backgroundColor: "#F6F3F4", WebkitFilter: "drop-shadow(0px 0px 0px #666)", filter: "drop-shadow(0px 5px 5px #666)", marginTop: 20, marginBottom: 20, width: 800 } },
						"Students of computer science are often prompted to experiment with project-based learning because it gives the opportunity to focus on solving a bigger-picture problem than most school assignments. Working on extracurricular projects gives valuable skills, experience, an attractive interview topic, and an entry in one's repertoire.",
						React.createElement("br", null),
						"Our new Group Project initiative is an effort to create a supportive community for students interested in pursuing extracurricular projects. It is open to all students at any time.",
						React.createElement("br", null),
						"We will meet once a month to discuss big-picture challenges, solutions, and successes, with a focus on how to make success contagious. At the end of the year, Group Projects will conclude with Demo Day, where groups will show off their outcomes and receive prizes voted on by the community.",
						React.createElement("br", null),
						React.createElement("br", null),
						"If you are interested in participating in group projects, fill out the following ",
						React.createElement(
							"a",
							{ href: "http://tinyurl.com/sodagroupprojects17", target: "_blank", style: { textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000" } },
							"form"
						),
						React.createElement("br", null),
						React.createElement("br", null),
						"Current Group Projects: ",
						React.createElement("br", null),
						React.createElement("br", null),
						"1-",
						React.createElement("br", null),
						"2-",
						React.createElement("br", null),
						"3-",
						React.createElement("br", null)
					)
				)
			),
			React.createElement("br", null),
			React.createElement("br", null),
			React.createElement("br", null),
			React.createElement("br", null),
			React.createElement("div", { id: "mentorship" }),
			React.createElement(
				Card,
				{ styling: { backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, padding: 10, paddingLeft: 25, paddingRight: 25 } },
				React.createElement(
					"b",
					{ style: { color: "#FFF", fontSize: 45, lineHeight: "60px", fontFamily: "RopaSansPro-Extrabold" } },
					"MENTORSHIP PROGRAM"
				)
			),
			React.createElement(
				"div",
				null,
				React.createElement(
					"div",
					{ style: { position: "relative", textAlign: "center", display: "inline-block" } },
					React.createElement(
						"div",
						{ style: { fontSize: 25, fontFamily: "RopaSansPro-Regular", textAlign: "left", padding: 50, paddingTop: 25, display: "inline-block", backgroundColor: "#F6F3F4", WebkitFilter: "drop-shadow(0px 0px 0px #666)", filter: "drop-shadow(0px 5px 5px #666)", marginTop: 20, marginBottom: 20, width: 800 } },
						"For many individuals, mentorship is an important part of of their professional and individual growth. There is a lot of benefit in having a mentor within one's field of study. With our Mentorship Program, we aim to provide a platform for mentees interested with mentorship opportunities to engage with mentors within the ASU community. With this we hope that there will always be someone within SoDA that students can go to when they have questions or need someone to talk to.",
						React.createElement("br", null),
						React.createElement("br", null),
						"If you are interested in becoming a mentor, fill out the following ",
						React.createElement(
							"a",
							{ href: "http://tinyurl.com/sodamentor17", target: "_blank", style: { textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000" } },
							"form"
						),
						React.createElement("br", null),
						"If you are interested in becoming a mentee, fill out the following ",
						React.createElement(
							"a",
							{ href: "http://tinyurl.com/sodamentee17", target: "_blank", style: { textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000" } },
							"form"
						)
					)
				)
			),
			React.createElement("br", null),
			React.createElement("br", null),
			React.createElement("br", null),
			React.createElement("br", null),
			React.createElement("div", { id: "distinguished" }),
			React.createElement(
				Card,
				{ styling: { backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, padding: 10, paddingLeft: 25, paddingRight: 25 } },
				React.createElement(
					"b",
					{ style: { color: "#FFF", fontSize: 45, lineHeight: "60px", fontFamily: "RopaSansPro-Extrabold" } },
					"DISTINGUISHED SoDA MEMBERSHIP"
				)
			),
			React.createElement(
				"div",
				null,
				React.createElement(
					"div",
					{ style: { position: "relative", textAlign: "center", display: "inline-block" } },
					React.createElement(
						"div",
						{ style: { fontSize: 25, fontFamily: "RopaSansPro-Regular", textAlign: "left", padding: 50, paddingTop: 25, display: "inline-block", backgroundColor: "#F6F3F4", WebkitFilter: "drop-shadow(0px 0px 0px #666)", filter: "drop-shadow(0px 5px 5px #666)", marginTop: 20, marginBottom: 20, width: 800 } },
						"SoDA's Distinguished Member Program is an initiative created with the intention of recognizing students who are highly involved in SoDA's activities and community. Admission into the distinguished member program is based on a point system from attendance and participation in SoDA activities including the other initiatives. Perks include an invitation to SoDA's linkedin alumni group, distinguished member resume books given to our industry partners, and giveaways exclusive to distinguished members. Once a Distinguished SoDA member, you are eligible to get personal one-on-one resume reviews from one of our officers to make sure it is high quality.",
						React.createElement("br", null),
						React.createElement("br", null),
						"You can become a Distinguished SoDA member by earning 12 points. You can earn points as follows:",
						React.createElement("br", null),
						"1 point per meeting you attend",
						React.createElement("br", null),
						"3 points for being a mentor",
						React.createElement("br", null),
						"2 points for every group projects meeting attended",
						React.createElement("br", null),
						"2 points for every mentorship meeting attended",
						React.createElement("br", null),
						"3 points for volunteering at a Dean's Funding event for SoDA",
						React.createElement("br", null),
						"3 points for leading a workshop",
						React.createElement("br", null),
						React.createElement("br", null),
						"If you become a Distinguished SoDA member in the Fall, you only need to earn 6 points by the end of February to keep your Distinguished membership"
					)
				)
			)
		)
	);
};

const MobileCommunityPage = ({ width, height }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"div",
			{ style: { width: width, backgroundColor: "#F6F3F4", id: "careers", paddingBottom: 40 } },
			React.createElement(
				"div",
				{ style: { padding: 40, paddingLeft: 20 } },
				React.createElement(
					"div",
					{ style: { fontSize: width / 5 < 100 ? width / 5 : 100, fontFamily: "RopaSansPro-Thin" } },
					"Community."
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ style: { display: "inline-block", width: "100%" } },
					React.createElement(
						"div",
						{ style: {} },
						React.createElement(
							"div",
							{ style: { fontSize: width / 20 < 25 ? width / 20 : 25, fontFamily: "RopaSansPro-Light", color: "#000" } },
							"One of SoDA's missions is to foster a sense of community and create a support network within its members. This year we are introducing the Group Projects initiative, Mentorship Program, and Distinguished SoDA membership. They all align with the goals of providing further career development opportunities for our members and encourage more familiarity and collaboration within the club."
						),
						React.createElement("br", null)
					)
				)
			)
		),
		React.createElement(
			"div",
			{ style: { padding: 20, textAlign: "center" } },
			React.createElement(
				"div",
				{ style: { display: "inline-block" }, id: "sunhacks" },
				React.createElement(
					Palette,
					{ title: "Group Projects", titleAlign: "left", contentAlign: "left", width: width - 100 < 700 ? width - 100 : 700 },
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Light", fontSize: width / 25 < 24 ? width / 25 : 24 } },
						"Students of computer science are often prompted to experiment with project-based learning because it gives the opportunity to focus on solving a bigger-picture problem than most school assignments. Working on extracurricular projects gives valuable skills, experience, an attractive interview topic, and an entry in one's repertoire. Our new Group Project initiative is an effort to create a supportive community for students interested in pursuing extracurricular projects. It is open to all students at any time.",
						React.createElement("br", null),
						React.createElement("br", null),
						"We will meet once a month to discuss big-picture challenges, solutions, and successes, with a focus on how to make success contagious. At the end of the year, Group Projects will conclude with Demo Day, where groups will show off their outcomes and receive prizes voted on by the community.",
						React.createElement("br", null),
						React.createElement("br", null),
						"If you are interested fill out this ",
						React.createElement(
							"a",
							{ href: "http://tinyurl.com/sodagroupprojects17", style: { textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000" }, target: "_blank" },
							"form"
						)
					)
				)
			),
			React.createElement("br", null),
			React.createElement(
				"div",
				{ style: { display: "inline-block" }, id: "sunhacks" },
				React.createElement(
					Palette,
					{ title: "Mentorship Program", titleAlign: "left", contentAlign: "left", width: width - 100 < 700 ? width - 100 : 700 },
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Light", fontSize: width / 25 < 24 ? width / 25 : 24 } },
						"For many individuals, mentorship is an important part of of their professional and individual growth. There is a lot of benefit in having a mentor within one's field of study. With our Mentorship Program, we aim to provide a platform for mentees interested with mentorship opportunities to engage with mentors within the ASU community. With this we hope that there will always be someone within SoDA that students can go to when they have questions or need someone to talk to.",
						React.createElement("br", null),
						React.createElement("br", null),
						"If you are interested fill out this ",
						React.createElement(
							"a",
							{ href: "http://tinyurl.com/sodamentor17", style: { textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000" }, target: "_blank" },
							"form"
						),
						React.createElement("br", null),
						"If you are interested fill out this ",
						React.createElement(
							"a",
							{ href: "http://tinyurl.com/sodamentee17", style: { textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000" }, target: "_blank" },
							"form"
						)
					)
				)
			),
			React.createElement(
				"div",
				{ style: { display: "inline-block" }, id: "sunhacks" },
				React.createElement(
					Palette,
					{ title: "Distinguished SoDA Membership Program", titleAlign: "left", contentAlign: "left", width: width - 100 < 700 ? width - 100 : 700 },
					React.createElement("br", null),
					React.createElement(
						"div",
						{ style: { fontFamily: "RopaSansPro-Light", fontSize: width / 25 < 24 ? width / 25 : 24 } },
						"SoDA's Distinguished Member Program is an initiative created with the intention of recognizing students who are highly involved in SoDA's activities and community. Admission into the distinguished member program is based on a point system from attendance and participation in SoDA activities including the other initiatives. Perks include an invitation to SoDA's linkedin alumni group, distinguished member resume books given to our industry partners, and giveaways exclusive to distinguished members. Once a Distinguished SoDA member, you are eligible to get personal one-on-one resume reviews from one of our officers to make sure it is high quality.",
						React.createElement("br", null),
						React.createElement("br", null),
						"You can become a Distinguished SoDA member by earning 12 points. You can earn points as follows:",
						React.createElement("br", null),
						"1 point per meeting you attend",
						React.createElement("br", null),
						"3 points for being a mentor",
						React.createElement("br", null),
						"2 points for every group projects meeting attended",
						React.createElement("br", null),
						"2 points for every mentorship meeting attended",
						React.createElement("br", null),
						"3 points for volunteering at a Dean's Funding event for SoDA",
						React.createElement("br", null),
						"3 points for leading a workshop",
						React.createElement("br", null),
						React.createElement("br", null),
						"If you become a Distinguished SoDA member in the Fall, you only need to earn 6 points by the end of February to keep your Distinguished membership"
					)
				)
			)
		)
	);
};

const SponsorLogo = ({ width, link, image }) => {
	return React.createElement(
		"a",
		{ target: "_blank", style: { textDecoration: "none" }, href: link },
		React.createElement(
			"div",
			{ style: { marginBottom: 50 } },
			React.createElement("img", { src: image, width: width })
		)
	);
};

const ContactPage = ({ width, height }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"div",
			{ style: { width: width, backgroundColor: "#F6F3F4", id: "hackathon" } },
			React.createElement(
				"div",
				{ style: { padding: 40, paddingLeft: 40 } },
				React.createElement(
					"div",
					{ style: { fontSize: 150, fontFamily: "RopaSansPro-Thin" } },
					"Contact us."
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ style: { display: "inline-block", width: "100%" } },
					React.createElement(
						"div",
						{ style: { display: "inline-block" } },
						React.createElement(
							"div",
							{ style: { fontSize: 40, fontFamily: "RopaSansPro-Medium", color: "#808080" } },
							" SoDA officers are here to help you. Please feel free to reach out to any of us by e-mail, slack, or social media. We want to help and would be happy to answer any questions you have."
						)
					)
				)
			)
		),
		React.createElement("div", { id: "officers" }),
		React.createElement(
			"div",
			{ style: { textAlign: "center", position: "relative", top: 50 } },
			React.createElement(MembershipCard, { title: "President", name: "Michelle Capriles-Escobedo", email: "mcaprile@asu.edu", link: "https://www.linkedin.com/in/mcaprile/" }),
			React.createElement(MembershipCard, { title: "Vice President", name: "Daniel Baird", email: "jamesdanielbaird@gmail.com", link: "https://www.linkedin.com/in/james-daniel-baird-a85608ba/" }),
			React.createElement(MembershipCard, { title: "Treasurer", name: "Lewis Ruskin", email: "ljruskin@asu.edu", link: "https://www.linkedin.com/in/ljruskin/" }),
			React.createElement(MembershipCard, { title: "Secretary", name: "Alex Geschardt", email: "ageschar@asu.edu", link: "https://www.linkedin.com/in/alex-geschardt-732a12a8/" }),
			React.createElement(MembershipCard, { title: "USG Liaison", name: "Lilian Ngweta", email: "lngweta@asu.edu", link: "https://www.linkedin.com/in/lilianngweta/" }),
			React.createElement(MembershipCard, { title: "Director of Documentation", name: "Siddhant Kanwar", email: "skanwar2@asu.edu", link: "https://www.linkedin.com/in/siddhantkanwar/" }),
			React.createElement(MembershipCard, { title: "Industry Outreach Chair - Event Planning Lead", name: "Chris Warren", email: "cawarre6@asu.edu", link: "https://www.linkedin.com/in/chris-warren-cj-24347178/" }),
			React.createElement(MembershipCard, { title: "Director of Group Projects", name: "Steven King Jr.", email: "stevekx86@gmail.com", link: "https://www.linkedin.com/in/steve-king-jr-9b5283a8/" }),
			React.createElement(MembershipCard, { title: "Director of Career Development", name: "Nikola Uzelac", email: "nuzelac@asu.edu", link: "https://www.linkedin.com/in/nickuzelac/" }),
			React.createElement(MembershipCard, { title: "Industry Outreach Chair", name: "Andrew Phillips", email: "aphill23@asu.edu", link: "https://www.linkedin.com/in/andrewphillips20/" }),
			React.createElement(MembershipCard, { title: "Director of Operations", name: "Sagarika Pannase", email: "spannase@gmail.com", link: "https://www.linkedin.com/in/sagarikapannase/" }),
			React.createElement(MembershipCard, { title: "Community Development Director", name: "Jacob Folsom", email: "jfolsom2@asu.edu", link: "https://www.linkedin.com/in/jacob-folsom-68148b125/" }),
			React.createElement(MembershipCard, { title: "Lead Development Director", name: "Somesh Singh", email: "ssing213@asu.edu", link: "" }),
			React.createElement(MembershipCard, { title: "Social Chair", name: "Lukas Zygas", email: "lzygas@asu.edu", link: "https://www.linkedin.com/in/lukas-zygas-105b57a5/" }),
			React.createElement(MembershipCard, { title: "Community Outreach Chair", name: "Rishi Bharadwaj Avvaru", email: "avvarurishi123@gmail.com", link: "" }),
			React.createElement(MembershipCard, { title: "Director of Marketing - Marketing Lead", name: "Michael Rojas", email: "mikerojaswa@gmail.com", link: "https://www.linkedin.com/in/mikerojaswa/" }),
			React.createElement(MembershipCard, { title: "Director of Communications", name: "Raffi Shahbazian", email: "raffi.p.shahbazian@gmail.com", link: "https://www.linkedin.com/in/raffipshahbazian/" }),
			React.createElement(MembershipCard, { title: "Director of Digital Media", name: "Junshu Liu", email: "jliu237@asu.edu", link: "https://www.linkedin.com/in/junshu-liu-52ba26105/" }),
			React.createElement(MembershipCard, { title: "Public Engagement Chair", name: "Justin Dierken", email: "jdierken@asu.edu", link: "https://www.linkedin.com/in/justindierken/" }),
			React.createElement(MembershipCard, { title: "Webmaster", name: "Vincent Truong", email: "vincenttruong96@gmail.com, vntruon1@asu.edu", link: "https://www.linkedin.com/in/vntruon1/" }),
			React.createElement(MembershipCard, { title: "Web Developer", name: "Azaldin Freidoon", email: "azaldin123@yahoo.com", link: "https://www.linkedin.com/in/azaldin-freidoon-b18207105/" }),
			React.createElement(MembershipCard, { title: "Photographer", name: "Jona Joe", email: "jjoe3@asu.edu", link: "https://www.linkedin.com/in/jona-joe-932a62149/" }),
			React.createElement(MembershipCard, { title: "Student Advisor", name: "Nathan Fegard", email: "nfegard@asu.edu", link: "https://www.linkedin.com/in/nathan-fegard-03692911b/" })
		),
		React.createElement("div", { id: "sponsors" }),
		React.createElement(
			"div",
			{ style: { textAlign: "center", position: "relative", top: 150 } },
			React.createElement("div", { id: "group_projects" }),
			React.createElement(
				Card,
				{ styling: { backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, padding: 10, paddingLeft: 25, paddingRight: 25 } },
				React.createElement(
					"b",
					{ style: { color: "#FFF", fontSize: 45, lineHeight: "60px", fontFamily: "RopaSansPro-Extrabold" } },
					"Sponsors"
				)
			),
			React.createElement(
				"div",
				{ style: { position: "Relative", top: 50 } },
				React.createElement(SponsorLogo, { width: 500, link: "https://www.allstate.com/", image: "images/AllState2017_logo.png" }),
				React.createElement(SponsorLogo, { width: 500, link: "https://www.amazon.com", image: "images/Amazon_logo.jpg" }),
				React.createElement(SponsorLogo, { width: 500, link: "https://jobs.americanexpress.com/tech", image: "images/AmericanExpress_logo.png" }),
				React.createElement(SponsorLogo, { width: 250, link: "https://www.starbucks.com/", image: "images/starbucks_logo.jpg" }),
				React.createElement(SponsorLogo, { width: 500, link: "https://www.workiva.com/", image: "images/Workiva_logo.png" }),
				React.createElement(SponsorLogo, { width: 350, link: "https://www.godaddy.com/", image: "images/GoDaddy_logo.png" }),
				React.createElement(SponsorLogo, { width: 350, link: "https://www.statefarm.com/", image: "images/Statefarm_logo.png" }),
				React.createElement(SponsorLogo, { width: 200, link: "http://connexta.com/", image: "images/Connexta_logo.jpg" }),
				React.createElement(SponsorLogo, { width: 200, link: "https://www.paypal.com/us/home", image: "https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_200x51.png" }),
				React.createElement(SponsorLogo, { width: 200, link: "http://www.goldmansachs.com/", image: "images/GoldmanSachs_logo.jpg" }),
				React.createElement(SponsorLogo, { width: 200, link: "https://careers.google.com/", image: "images/google_logo.png" })
			)
		)
	);
};

const MobileContactPage = ({ width, height }) => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"div",
			{ style: { width: width, backgroundColor: "#F6F3F4", id: "hackathon" } },
			React.createElement(
				"div",
				{ style: { padding: 40, paddingLeft: 40 } },
				React.createElement(
					"div",
					{ style: { fontSize: width / 5.5 < 100 ? width / 5.5 : 100, fontFamily: "RopaSansPro-Thin" } },
					"Contact us."
				),
				React.createElement("br", null),
				React.createElement(
					"div",
					{ style: { display: "inline-block", width: "100%" } },
					React.createElement(
						"div",
						{ style: {} },
						React.createElement(
							"div",
							{ style: { fontSize: width / 20 < 25 ? width / 20 : 25, fontFamily: "RopaSansPro-Light", color: "#000" } },
							"SoDA officers are here to help you. Please feel free to reach out to any of us by e-mail, slack, or social media. We want to help and would be happy to answer any questions you have."
						),
						React.createElement("br", null)
					)
				)
			)
		),
		React.createElement(
			"div",
			{ style: { textAlign: "center", position: "relative", top: 50 } },
			React.createElement(MobileMembershipCard, { title: "President", name: "Michelle Capriles-Escobedo", email: "mcaprile@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Vice President", name: "Daniel Baird", email: "jamesdanielbaird@gmail.com", width: width }),
			React.createElement(MobileMembershipCard, { title: "Treasurer", name: "Lewis Ruskin", email: "ljruskin@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Secretary", name: "Alex Geschardt", email: "ageschar@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "USG Liaison", name: "Lilian Ngweta", email: "lngweta@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Director of Documentation", name: "Siddhant Kanwar", email: "skanwar2@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Industry Outreach Chair - Event Planning Lead", name: "Chris Warren", email: "cawarre6@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Director of Group Projects", name: "Steven King Jr.", email: "stevekx86@gmail.com", width: width }),
			React.createElement(MobileMembershipCard, { title: "Director of Career Development", name: "Nikola Uzelac", email: "nuzelac@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Industry Outreach Chair", name: "Andrew Phillips", email: "aphill23@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Director of Operations", name: "Sagarika Pannase", email: "spannase@gmail.com", width: width }),
			React.createElement(MobileMembershipCard, { title: "Community Development Director", name: "Jacob Folson", email: "jfolsom2@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Lead Development Director", name: "Somesh Singh", email: "ssing213@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Social Chair", name: "Lukas Zygas", email: "lzygas@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Community Outreach Chair", name: "Rishi Bharadwaj Avvaru", email: "avvarurishi123@gmail.com", width: width }),
			React.createElement(MobileMembershipCard, { title: "Director of Marketing - Marketing Lead", name: "Michael Rojas", email: "mikerojaswa@gmail.com", width: width }),
			React.createElement(MobileMembershipCard, { title: "Director of Communications", name: "Raffi Shahbazian", email: "raffi.p.shahbazian@gmail.com", width: width }),
			React.createElement(MobileMembershipCard, { title: "Director of Digital Media", name: "Junshu Liu", email: "jliu237@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Public Engagement Chair", name: "Justin Dierken", email: "jdierken@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Webmaster", name: "Vincent Truong", email: "vincenttruong96@gmail.com, vntruon1@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Web Developer", name: "Azaldin Freidoon", email: "azaldin123@yahoo.com", width: width }),
			React.createElement(MobileMembershipCard, { title: "Photographer", name: "Jona Joe", email: "jjoe3@asu.edu", width: width }),
			React.createElement(MobileMembershipCard, { title: "Student Advisor", name: "Nathan Fegard", email: "nfegard@asu.edu", width: width })
		),
		React.createElement(
			"div",
			{ style: { textAlign: "center", position: "relative", top: 150 }, id: "sponsors" },
			React.createElement("div", { id: "group_projects" }),
			React.createElement(
				Card,
				{ styling: { backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, padding: 10, paddingLeft: 25, paddingRight: 25 } },
				React.createElement(
					"b",
					{ style: { color: "#FFF", fontSize: 45, lineHeight: "60px", fontFamily: "RopaSansPro-Extrabold" } },
					"Sponsors"
				)
			),
			React.createElement(
				"div",
				{ style: { position: "Relative", top: 50 } },
				React.createElement(
					"div",
					{ style: { marginBottom: 50 } },
					React.createElement("img", { src: "images/AllState2017_logo.png", width: width - 50 < 500 ? width - 50 : 500 })
				),
				React.createElement(
					"div",
					{ style: { marginBottom: 50 } },
					React.createElement("img", { src: "images/Amazon_logo.jpg", width: width - 50 < 500 ? width - 50 : 500 })
				),
				React.createElement(
					"div",
					{ style: { marginBottom: 50 } },
					React.createElement("img", { src: "images/AmericanExpress_logo.png", width: width - 50 < 500 ? width - 50 : 500 })
				),
				React.createElement(
					"div",
					{ style: { marginBottom: 50 } },
					React.createElement("img", { src: "images/starbucks_logo.jpg", width: width / 2 < 250 ? width / 2 : 250 })
				),
				React.createElement(
					"div",
					{ style: { marginBottom: 50 } },
					React.createElement("img", { src: "images/Workiva_logo.png", width: width - 50 < 500 ? width - 50 : 500 })
				),
				React.createElement(
					"div",
					{ style: { marginBottom: 50 } },
					React.createElement("img", { src: "images/GoDaddy_logo.png", width: width / 1.5 < 350 ? width / 1.5 : 350 })
				),
				React.createElement(
					"div",
					{ style: { marginBottom: 50 } },
					React.createElement("img", { src: "images/Statefarm_logo.png", width: width / 1.5 < 350 ? width / 1.5 : 350 })
				),
				React.createElement(
					"div",
					{ style: { marginBottom: 50 } },
					React.createElement("img", { src: "images/Connexta_logo.jpg", width: width / 2.5 < 200 ? width / 2.5 : 200 })
				),
				React.createElement(
					"div",
					{ style: { marginBottom: 50 } },
					React.createElement("img", { src: "images/GoldmanSachs_logo.jpg", width: width / 2.5 < 200 ? width / 2.5 : 200 })
				),
				React.createElement(
					"div",
					{ style: { marginBottom: 50 } },
					React.createElement("img", { src: "images/google_logo.png", width: width / 2.5 < 200 ? width / 2.5 : 200 })
				)
			)
		)
	);
};

var App = React.createClass({
	displayName: "App",

	getInitialState: function () {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
			currentPage: "home"
		};
	},
	componentDidMount: function () {
		window.addEventListener('scroll', this.handleScroll);
		window.addEventListener("resize", this.updateWindowDimensions);
	},
	componentWillUnmount: function () {
		window.removeEventListener('scroll', this.handleScroll);
		window.removeEventListener("resize", this.updateWindowDimensions);
	},
	handleScroll: function (event) {
		var yoffset = event.path[1].pageYOffset;
		var currentPage = this.currentPage;
		if (yoffset >= 10726) {
			if (currentPage != "contact us") this.setState(_extends({}, this.state, { currentPage: "contact us" }));
		} else if (yoffset >= 8043) {
			if (currentPage != "community") this.setState(_extends({}, this.state, { currentPage: "community" }));
		} else if (yoffset >= 6245) {
			if (currentPage != "hackathon") this.setState(_extends({}, this.state, { currentPage: "hackathon" }));
		} else if (yoffset >= 4953) {
			if (currentPage != "careers") this.setState(_extends({}, this.state, { currentPage: "careers" }));
		} else if (yoffset >= 3360) {
			if (currentPage != "events") this.setState(_extends({}, this.state, { currentPage: "events" }));
		} else if (yoffset >= 2600) {
			if (currentPage != "about") this.setState(_extends({}, this.state, { currentPage: "about" }));
		} else if (yoffset >= 0) {
			if (currentPage != "home") this.setState(_extends({}, this.state, { currentPage: "home" }));
		}
	},
	updateWindowDimensions: function () {
		this.setState(_extends({}, this.state, { width: window.innerWidth }));
	},
	render: function () {
		if (window.innerWidth >= 1075) {
			return React.createElement(
				"div",
				null,
				React.createElement(
					"div",
					{ id: "home" },
					React.createElement(DesktopWebsiteHeader, { width: this.state.width, height: 400 })
				),
				React.createElement(DesktopWebsiteAboutUs, { width: this.state.width }),
				React.createElement("div", { id: "about" }),
				React.createElement(
					"div",
					{ style: { top: 80, position: "relative", textAlign: "center" } },
					React.createElement(AboutPage, { width: this.state.width })
				),
				React.createElement("div", { id: "events" }),
				React.createElement(
					"div",
					{ style: { top: 150, position: "relative" } },
					React.createElement(EventPage, { width: this.state.width, height: 1000 })
				),
				React.createElement("div", { id: "careers" }),
				React.createElement(
					"div",
					{ style: { top: 150, position: "relative" } },
					React.createElement(CareersPage, { width: this.state.width, height: 1500 })
				),
				React.createElement("div", { id: "hackathon" }),
				React.createElement(
					"div",
					{ style: { top: 150, position: "relative" } },
					React.createElement(HackathonPage, { width: this.state.width, height: 1800 })
				),
				React.createElement("div", { id: "community" }),
				React.createElement(
					"div",
					{ style: { top: 150, position: "relative" } },
					React.createElement(CommunityPage, { width: this.state.width, height: 1300 })
				),
				React.createElement("div", { id: "contacts" }),
				React.createElement(
					"div",
					{ style: { top: 250, position: "relative" } },
					React.createElement(ContactPage, { width: this.state.width, height: 1500 })
				),
				React.createElement(DesktopNavigationBar, { width: this.state.width, height: NAV_BAR_HEIGHT, currentPage: this.state.currentPage })
			);
		} else {
			return React.createElement(
				"div",
				null,
				React.createElement(MobileWebsiteHeader, { width: this.state.width, height: this.state.width / 2 < 300 ? this.state.width / 2 : 300 }),
				React.createElement(MobileWebsiteAboutUs, { width: this.state.width, height: 3.5 * this.state.width < 1800 ? 3.5 * this.state.width : 1800 }),
				React.createElement(
					"div",
					{ style: { top: 40, position: "relative", textAlign: "center" } },
					React.createElement(MobileAboutPage, { width: this.state.width })
				),
				React.createElement(
					"div",
					{ style: { top: 150, position: "relative" }, id: "events" },
					React.createElement(MobileEventPage, { width: this.state.width, height: 3 * this.state.width < 1600 ? 3 * this.state.width : 1600 })
				),
				React.createElement(
					"div",
					{ style: { top: 650, position: "relative" }, id: "careers" },
					React.createElement(MobileCareersPage, { width: this.state.width, height: 1500 })
				),
				React.createElement(
					"div",
					{ style: { top: 650, position: "relative" }, id: "hackathon" },
					React.createElement(MobileHackathonPage, { width: this.state.width, height: 4 * this.state.width < 1800 ? 4 * this.state.width : 1800 })
				),
				React.createElement(
					"div",
					{ style: { top: 650, position: "relative" }, id: "community" },
					React.createElement(MobileCommunityPage, { width: this.state.width, height: 1300 })
				),
				React.createElement(
					"div",
					{ style: { top: 750, position: "relative" }, id: "contacts" },
					React.createElement(MobileContactPage, { width: this.state.width, height: 1500 })
				),
				React.createElement(MobileNavigationBar, { width: this.state.width, height: NAV_BAR_HEIGHT })
			);
		}
	}
});

var Timeline = require('react-twitter-widgets').Timeline;

ReactDOM.render(React.createElement(
	"div",
	{ style: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 } },
	React.createElement(Timeline, { dataSource: { sourceType: "profile", screenName: "twitterdev" }, options: { username: "TwitterDev", height: "400" } })
), document.querySelector("#container"));

},{"react-twitter-widgets":143}],171:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[170]);
