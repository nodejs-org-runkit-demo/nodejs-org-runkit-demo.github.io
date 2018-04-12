---
component: module
---
# Buffer

<!--introduced_in=v0.1.90-->
<!--lint disable maximum-line-length-->

> Stability: 2 - Stable

Prior to the introduction of [`TypedArray`], the JavaScript language had no
mechanism for reading or manipulating streams of binary data. The `Buffer` class
was introduced as part of the Node.js API to make it possible to interact with
octet streams in the context of things like TCP streams and file system
operations.

With [`TypedArray`] now available, the `Buffer` class implements the
[`Uint8Array`] API in a manner that is more optimized and suitable for Node.js.

Instances of the `Buffer` class are similar to arrays of integers but
correspond to fixed-sized, raw memory allocations outside the V8 heap.
The size of the `Buffer` is established when it is created and cannot be
changed.

The `Buffer` class is within the global scope, making it unlikely that one
would need to ever use `require('buffer').Buffer`.

```js runkit
// Creates a zero-filled Buffer of length 10.
console.log(Buffer.alloc(10));

// Creates a Buffer of length 10, filled with 0x1.
console.log(Buffer.alloc(10, 1));

// Creates a Buffer containing UTF-8 bytes [0x74, 0xc3, 0xa9, 0x73, 0x74].
console.log(Buffer.from('tést'));

// Creates a Buffer containing Latin-1 bytes [0x74, 0xe9, 0x73, 0x74].
console.log(Buffer.from('tést', 'latin1'));
```

### The `--zero-fill-buffers` command line option
<!-- YAML
added: v5.10.0
-->

Node.js can be started using the `--zero-fill-buffers` command line option to
cause all newly allocated `Buffer` instances to be zero-filled upon creation by
default, including buffers returned by `new Buffer(size)`,
[`Buffer.allocUnsafe()`], [`Buffer.allocUnsafeSlow()`], and `new
SlowBuffer(size)`. Use of this flag can have a significant negative impact on
performance. Use of the `--zero-fill-buffers` option is recommended only when
necessary to enforce that newly allocated `Buffer` instances cannot contain old
data that is potentially sensitive.

```js runkit
// Zero fill buffers.

Buffer.allocUnsafe(5);
```

### What makes `Buffer.allocUnsafe()` and `Buffer.allocUnsafeSlow()` "unsafe"?

When calling [`Buffer.allocUnsafe()`] and [`Buffer.allocUnsafeSlow()`], the
segment of allocated memory is *uninitialized* (it is not zeroed-out). While
this design makes the allocation of memory quite fast, the allocated segment of
memory might contain old data that is potentially sensitive. Using a `Buffer`
created by [`Buffer.allocUnsafe()`] without *completely* overwriting the memory
can allow this old data to be leaked when the `Buffer` memory is read.

While there are clear performance advantages to using [`Buffer.allocUnsafe()`],
extra care *must* be taken in order to avoid introducing security
vulnerabilities into an application.

## Buffers and Character Encodings
<!-- YAML
changes:
  - version: v6.4.0
    pr-url: https://github.com/nodejs/node/pull/7111
    description: Introduced `latin1` as an alias for `binary`.
  - version: v5.0.0
    pr-url: https://github.com/nodejs/node/pull/2859
    description: Removed the deprecated `raw` and `raws` encodings.
-->

When string data is stored in or extracted out of a `Buffer` instance, a
character encoding may be specified.

```js runkit
const buf = Buffer.from('hello world', 'ascii');

console.log(buf.toString('hex'));
// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Prints: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'ascii'));
// Prints: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Prints: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

The character encodings currently supported by Node.js include:

* `'ascii'` - For 7-bit ASCII data only. This encoding is fast and will strip
  the high bit if set.

* `'utf8'` - Multibyte encoded Unicode characters. Many web pages and other
  document formats use UTF-8.

* `'utf16le'` - 2 or 4 bytes, little-endian encoded Unicode characters.
  Surrogate pairs (U+10000 to U+10FFFF) are supported.

* `'ucs2'` - Alias of `'utf16le'`.

* `'base64'` - Base64 encoding. When creating a `Buffer` from a string,
  this encoding will also correctly accept "URL and Filename Safe Alphabet" as
  specified in [RFC4648, Section 5].

* `'latin1'` - A way of encoding the `Buffer` into a one-byte encoded string
  (as defined by the IANA in [RFC1345],
  page 63, to be the Latin-1 supplement block and C0/C1 control codes).

* `'binary'` - Alias for `'latin1'`.

* `'hex'` - Encode each byte as two hexadecimal characters.

Modern Web browsers follow the [WHATWG Encoding Standard][] which aliases
both `'latin1'` and `'ISO-8859-1'` to `'win-1252'`. This means that while doing
something like `http.get()`, if the returned charset is one of those listed in
the WHATWG specification it is possible that the server actually returned
win-1252-encoded data, and using `'latin1'` encoding may incorrectly decode the
characters.

## Buffers and TypedArray
<!-- YAML
changes:
  - version: v3.0.0
    pr-url: https://github.com/nodejs/node/pull/2002
    description: The `Buffer`s class now inherits from `Uint8Array`.
-->

`Buffer` instances are also [`Uint8Array`] instances. However, there are subtle
incompatibilities with [`TypedArray`]. For example, while
[`ArrayBuffer#slice()`] creates a copy of the slice, the implementation of
[`Buffer#slice()`][`buf.slice()`] creates a view over the existing `Buffer`
without copying, making [`Buffer#slice()`][`buf.slice()`] far more efficient.

It is also possible to create new [`TypedArray`] instances from a `Buffer` with
the following caveats:

1. The `Buffer` object's memory is copied to the [`TypedArray`], not shared.

2. The `Buffer` object's memory is interpreted as an array of distinct
elements, and not as a byte array of the target type. That is,
`new Uint32Array(Buffer.from([1, 2, 3, 4]))` creates a 4-element [`Uint32Array`]
   with elements `[1, 2, 3, 4]`, not a [`Uint32Array`] with a single element
   `[0x1020304]` or `[0x4030201]`.

It is possible to create a new `Buffer` that shares the same allocated memory as
a [`TypedArray`] instance by using the TypeArray object's `.buffer` property.

```js runkit
const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`
const buf1 = Buffer.from(arr);
// Shares memory with `arr`
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```

Note that when creating a `Buffer` using a [`TypedArray`]'s `.buffer`, it is
possible to use only a portion of the underlying [`ArrayBuffer`] by passing in
`byteOffset` and `length` parameters.

```js runkit
const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```

The `Buffer.from()` and [`TypedArray.from()`] have different signatures and
implementations. Specifically, the [`TypedArray`] variants accept a second
argument that is a mapping function that is invoked on every element of the
typed array:

* `TypedArray.from(source[, mapFn[, thisArg]])`

The `Buffer.from()` method, however, does not support the use of a mapping
function:

* [`Buffer.from(array)`]
* [`Buffer.from(buffer)`]
* [`Buffer.from(arrayBuffer[, byteOffset [, length]])`][`Buffer.from(arrayBuffer)`]
* [`Buffer.from(string[, encoding])`][`Buffer.from(string)`]

## Buffers and iteration

`Buffer` instances can be iterated over using `for..of` syntax:

```js runkit
const buf = Buffer.from([1, 2, 3]);

// Prints:
//   1
//   2
//   3
for (const b of buf) {
  console.log(b);
}
```

Additionally, the [`buf.values()`], [`buf.keys()`], and
[`buf.entries()`] methods can be used to create iterators.

## Class: Buffer

The `Buffer` class is a global type for dealing with binary data directly.
It can be constructed in a variety of ways.

### new Buffer(array)
<!-- YAML
deprecated: v6.0.0
changes:
  - version: v7.2.1
    pr-url: https://github.com/nodejs/node/pull/9529
    description: Calling this constructor no longer emits a deprecation warning.
  - version: v7.0.0
    pr-url: https://github.com/nodejs/node/pull/8169
    description: Calling this constructor emits a deprecation warning now.
-->

> Stability: 0 - Deprecated: Use [`Buffer.from(array)`] instead.

* `array` {integer[]} An array of bytes to copy from.

Allocates a new `Buffer` using an `array` of octets.

```js runkit
// Creates a new Buffer containing the UTF-8 bytes of the string 'buffer'
const buf = new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

### new Buffer(arrayBuffer[, byteOffset [, length]])
<!-- YAML
added: v3.0.0
deprecated: v6.0.0
changes:
  - version: v7.2.1
    pr-url: https://github.com/nodejs/node/pull/9529
    description: Calling this constructor no longer emits a deprecation warning.
  - version: v7.0.0
    pr-url: https://github.com/nodejs/node/pull/8169
    description: Calling this constructor emits a deprecation warning now.
  - version: v6.0.0
    pr-url: https://github.com/nodejs/node/pull/4682
    description: The `byteOffset` and `length` parameters are supported now.
-->

> Stability: 0 - Deprecated: Use
> [`Buffer.from(arrayBuffer[, byteOffset [, length]])`][`Buffer.from(arrayBuffer)`]
> instead.

* `arrayBuffer` {ArrayBuffer|SharedArrayBuffer} An [`ArrayBuffer`],
  [`SharedArrayBuffer`] or the `.buffer` property of a [`TypedArray`].
* `byteOffset` {integer} Index of first byte to expose. **Default:** `0`.
* `length` {integer} Number of bytes to expose.
  **Default:** `arrayBuffer.length - byteOffset`.

This creates a view of the [`ArrayBuffer`] or [`SharedArrayBuffer`] without
copying the underlying memory. For example, when passed a reference to the
`.buffer` property of a [`TypedArray`] instance, the newly created `Buffer` will
share the same allocated memory as the [`TypedArray`].

The optional `byteOffset` and `length` arguments specify a memory range within
the `arrayBuffer` that will be shared by the `Buffer`.

```js runkit
const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`
const buf = new Buffer(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```

### new Buffer(buffer)
<!-- YAML
deprecated: v6.0.0
changes:
  - version: v7.2.1
    pr-url: https://github.com/nodejs/node/pull/9529
    description: Calling this constructor no longer emits a deprecation warning.
  - version: v7.0.0
    pr-url: https://github.com/nodejs/node/pull/8169
    description: Calling this constructor emits a deprecation warning now.
-->

> Stability: 0 - Deprecated: Use [`Buffer.from(buffer)`] instead.

* `buffer` {Buffer} An existing `Buffer` to copy data from.

Copies the passed `buffer` data onto a new `Buffer` instance.

```js runkit
const buf1 = new Buffer('buffer');
const buf2 = new Buffer(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```

### new Buffer(size)
<!-- YAML
deprecated: v6.0.0
changes:
  - version: v8.0.0
    pr-url: https://github.com/nodejs/node/pull/12141
    description: new Buffer(size) will return zero-filled memory by default.
  - version: v7.2.1
    pr-url: https://github.com/nodejs/node/pull/9529
    description: Calling this constructor no longer emits a deprecation warning.
  - version: v7.0.0
    pr-url: https://github.com/nodejs/node/pull/8169
    description: Calling this constructor emits a deprecation warning now.
-->

> Stability: 0 - Deprecated: Use [`Buffer.alloc()`] instead (also see
> [`Buffer.allocUnsafe()`]).

* `size` {integer} The desired length of the new `Buffer`.

Allocates a new `Buffer` of `size` bytes. If the `size` is larger than
[`buffer.constants.MAX_LENGTH`] or smaller than 0, a [`RangeError`] will be
thrown. A zero-length `Buffer` will be created if `size` is 0.

Prior to Node.js 8.0.0, the underlying memory for `Buffer` instances
created in this way is *not initialized*. The contents of a newly created
`Buffer` are unknown and *may contain sensitive data*. Use
[`Buffer.alloc(size)`][`Buffer.alloc()`] instead to initialize a `Buffer`
with zeroes.

```js runkit
const buf = new Buffer(10);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

### new Buffer(string[, encoding])
<!-- YAML
deprecated: v6.0.0
changes:
  - version: v7.2.1
    pr-url: https://github.com/nodejs/node/pull/9529
    description: Calling this constructor no longer emits a deprecation warning.
  - version: v7.0.0
    pr-url: https://github.com/nodejs/node/pull/8169
    description: Calling this constructor emits a deprecation warning now.
-->

> Stability: 0 - Deprecated:
> Use [`Buffer.from(string[, encoding])`][`Buffer.from(string)`] instead.

* `string` {string} String to encode.
* `encoding` {string} The encoding of `string`. **Default:** `'utf8'`.

Creates a new `Buffer` containing `string`. The `encoding` parameter identifies
the character encoding of `string`.

```js runkit
const buf1 = new Buffer('this is a tést');
const buf2 = new Buffer('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Prints: this is a tést
console.log(buf2.toString());
// Prints: this is a tést
console.log(buf1.toString('ascii'));
// Prints: this is a tC)st
```


### buffer.constants.MAX_STRING_LENGTH
<!-- YAML
added: v8.2.0
-->

* {integer} The largest length allowed for a single `string` instance.

Represents the largest `length` that a `string` primitive can have, counted
in UTF-16 code units.

This value may depend on the JS engine that is being used.

[`ArrayBuffer#slice()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/slice
[`ArrayBuffer`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
[`Buffer.alloc()`]: #buffer_class_method_buffer_alloc_size_fill_encoding
[`Buffer.allocUnsafe()`]: #buffer_class_method_buffer_allocunsafe_size
[`Buffer.allocUnsafeSlow()`]: #buffer_class_method_buffer_allocunsafeslow_size
[`Buffer.from(array)`]: #buffer_class_method_buffer_from_array
[`Buffer.from(arrayBuffer)`]: #buffer_class_method_buffer_from_arraybuffer_byteoffset_length
[`Buffer.from(buffer)`]: #buffer_class_method_buffer_from_buffer
[`Buffer.from(string)`]: #buffer_class_method_buffer_from_string_encoding
[`Buffer.poolSize`]: #buffer_class_property_buffer_poolsize
[`DataView`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
[`JSON.stringify()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[`RangeError`]: errors.html#errors_class_rangeerror
[`SharedArrayBuffer`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
[`String#indexOf()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
[`String#lastIndexOf()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf
[`String.prototype.length`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length
[`TypedArray.from()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from
[`TypedArray`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
[`Uint32Array`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array
[`Uint8Array`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
[`buf.buffer`]: #buffer_buf_buffer
[`buf.compare()`]: #buffer_buf_compare_target_targetstart_targetend_sourcestart_sourceend
[`buf.entries()`]: #buffer_buf_entries
[`buf.fill()`]: #buffer_buf_fill_value_offset_end_encoding
[`buf.indexOf()`]: #buffer_buf_indexof_value_byteoffset_encoding
[`buf.keys()`]: #buffer_buf_keys
[`buf.length`]: #buffer_buf_length
[`buf.slice()`]: #buffer_buf_slice_start_end
[`buf.values()`]: #buffer_buf_values
[`buffer.kMaxLength`]: #buffer_buffer_kmaxlength
[`buffer.constants.MAX_LENGTH`]: #buffer_buffer_constants_max_length
[`buffer.constants.MAX_STRING_LENGTH`]: #buffer_buffer_constants_max_string_length
[`util.inspect()`]: util.html#util_util_inspect_object_options
[RFC1345]: https://tools.ietf.org/html/rfc1345
[RFC4648, Section 5]: https://tools.ietf.org/html/rfc4648#section-5
[WHATWG Encoding Standard]: https://encoding.spec.whatwg.org/
[iterator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols