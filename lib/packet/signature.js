// Generated by IcedCoffeeScript 1.6.3-g
(function() {
  var C, CreationTime, EmbeddedSignature, Exporatable, Features, Issuer, KeyExpirationTime, KeyFlags, KeyServerPreferences, NotationData, Packet, Parser, PolicyURI, Preference, PreferredCompressionAlgorithms, PreferredHashAlgorithms, PreferredKeyServer, PreferredSymmetricAlgorithms, PrimaryUserId, ReasonForRevocation, RegularExpression, Revocable, RevocationKey, S, SHA1, SHA512, SigExpirationTime, Signature, SignatureTarget, SignersUserID, SubPacket, Time, Trust, alloc_or_throw, asymmetric, encode_length, make_time_packet, uint_to_buffer, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };



  Packet = require('./base').Packet;

  C = require('../const').openpgp;

  S = C.sig_subpacket;

  _ref = require('../util'), uint_to_buffer = _ref.uint_to_buffer, encode_length = _ref.encode_length, make_time_packet = _ref.make_time_packet;

  _ref1 = require('../hash'), alloc_or_throw = _ref1.alloc_or_throw, SHA512 = _ref1.SHA512, SHA1 = _ref1.SHA1;

  asymmetric = require('../asymmetric');

  Signature = (function(_super) {
    __extends(Signature, _super);

    function Signature(_arg) {
      this.key = _arg.key, this.hash = _arg.hash, this.key_id = _arg.key_id, this.sig_data = _arg.sig_data, this.public_key_class = _arg.public_key_class, this.signed_hash_value_hash = _arg.signed_hash_value_hash, this.subpackets = _arg.subpackets, this.time = _arg.time, this.sig = _arg.sig, this.type = _arg.type;
      if (this.hash == null) {
        this.hash = SHA512;
      }
      if (this.subpackets == null) {
        this.subpackets = [];
      }
    }

    Signature.prototype.write = function(data, cb) {
      var flatsp, hash, result, result2, results, ret, s, sig, trailer;
      flatsp = Buffer.concat((function() {
        var _i, _len, _ref2, _results;
        _ref2 = this.subpackets;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          s = _ref2[_i];
          _results.push(s.to_buffer());
        }
        return _results;
      }).call(this));
      result = Buffer.concat([new Buffer([C.versions.signature.V4, this.type, this.key.type, this.hash.type]), uint_to_buffer(16, flatsp.length), flatsp]);
      trailer = Buffer.concat([new Buffer([C.versions.signature.V4, 0xff]), uint_to_buffer(32, result.length)]);
      Buffer.concat([data, result, trailer]);
      hash = this.hash(payload);
      sig = this.key.pad_and_sign(payload, {
        hash: this.hash
      });
      result2 = Buffer.concat([new Buffer([0, 0, hash.readUInt8(0), hash.readUInt8(1)]), sig]);
      results = Buffer.concat([result, result2]);
      ret = this.frame_packet(C.packet_tags.signature, results);
      return cb(null, ret);
    };

    Signature.parse = function(slice) {
      return (new Parser(slice)).parse();
    };

    return Signature;

  })(Packet);

  SubPacket = (function() {
    function SubPacket(type) {
      this.type = type;
    }

    SubPacket.prototype.to_buffer = function() {
      var inner;
      inner = this._v_to_buffer();
      return Buffer.concat([encode_length(inner.length), uint_to_buffer(8, this.type), inner]);
    };

    return SubPacket;

  })();

  Time = (function(_super) {
    __extends(Time, _super);

    function Time(type, time) {
      this.time = time;
      this.never_expires = this.time === 0;
      Time.__super__.constructor.call(this, type);
    }

    Time.parse = function(slice, klass) {
      return new klass(slice.read_uint32());
    };

    Time.prototype._v_to_buffer = function() {
      return uint_to_buffer(32, this.time);
    };

    return Time;

  })(SubPacket);

  Preference = (function(_super) {
    __extends(Preference, _super);

    function Preference(type, v) {
      this.v = v;
      Preference.__super__.constructor.call(this, type);
    }

    Preference.parse = function(slice, klass) {
      var c, v;
      v = (function() {
        var _i, _len, _ref2, _results;
        _ref2 = slice.consume_rest_to_buffer();
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          c = _ref2[_i];
          _results.push(c);
        }
        return _results;
      })();
      return new klass(v);
    };

    Preference.prototype._v_to_buffer = function() {
      var e;
      return new Buffer((function() {
        var _i, _len, _ref2, _results;
        _ref2 = this.v;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          e = _ref2[_i];
          _results.push(e);
        }
        return _results;
      }).call(this));
    };

    return Preference;

  })(SubPacket);

  CreationTime = (function(_super) {
    __extends(CreationTime, _super);

    function CreationTime(t) {
      CreationTime.__super__.constructor.call(this, S.creation_time, t);
    }

    CreationTime.parse = function(slice) {
      return Time.parse(slice, CreationTime);
    };

    return CreationTime;

  })(Time);

  SigExpirationTime = (function(_super) {
    __extends(SigExpirationTime, _super);

    function SigExpirationTime(t) {
      SigExpirationTime.__super__.constructor.call(this, S.expiration_time, t);
    }

    SigExpirationTime.parse = function(slice) {
      return Time.parse(slice, SigExpirationTime);
    };

    return SigExpirationTime;

  })(Time);

  Exporatable = (function(_super) {
    __extends(Exporatable, _super);

    function Exporatable(flag) {
      this.flag = flag;
      Exporatable.__super__.constructor.call(this, S.exportable_certificate);
    }

    Exporatable.parse = function(slice) {
      return new Exporatable(slice.read_uint8() === 1);
    };

    Exporatable.prototype._v_to_buffer = function() {
      return uint_to_buffer(8, this.flag);
    };

    return Exporatable;

  })(SubPacket);

  Trust = (function(_super) {
    __extends(Trust, _super);

    function Trust(level, amount) {
      this.level = level;
      this.amount = amount;
      Trust.__super__.constructor.call(this, S.trust_signature);
    }

    Trust.parse = function(slice) {
      return new Trust(slice.read_uint8(), slice.read_uint8());
    };

    Trust.prototype._v_to_buffer = function() {
      return Buffer.concat([uint_to_buffer(8, this.level), uint_to_buffer(8, this.amount)]);
    };

    return Trust;

  })(SubPacket);

  RegularExpression = (function(_super) {
    __extends(RegularExpression, _super);

    function RegularExpression(re) {
      this.re = re;
      RegularExpression.__super__.constructor.call(this, S.regular_expression);
    }

    RegularExpression.parse = function(slice) {
      var ret;
      ret = new RegularExpression(slice.consume_rest_to_buffer().toString('utf8'));
      console.log(ret.re);
      return ret;
    };

    RegularExpression.prototype._v_to_buffer = function() {
      return new Buffer(this.re, 'utf8');
    };

    return RegularExpression;

  })(SubPacket);

  Revocable = (function(_super) {
    __extends(Revocable, _super);

    function Revocable(flag) {
      this.flag = flag;
      Revocable.__super__.constructor.call(this, S.revocable);
    }

    Revocable.parse = function(slice) {
      return new Revocable(slice.read_uint8() === 1);
    };

    Revocable.prototype._v_to_buffer = function() {
      return uint_to_buffer(8, this.flag);
    };

    return Revocable;

  })(SubPacket);

  KeyExpirationTime = (function(_super) {
    __extends(KeyExpirationTime, _super);

    function KeyExpirationTime(t) {
      KeyExpirationTime.__super__.constructor.call(this, S.key_expiration_time, t);
    }

    KeyExpirationTime.parse = function(slice) {
      return Time.parse(slice, KeyExpirationTime);
    };

    return KeyExpirationTime;

  })(Time);

  PreferredSymmetricAlgorithms = (function(_super) {
    __extends(PreferredSymmetricAlgorithms, _super);

    function PreferredSymmetricAlgorithms(v) {
      PreferredSymmetricAlgorithms.__super__.constructor.call(this, S.preferred_symmetric_algorithms, v);
    }

    PreferredSymmetricAlgorithms.parse = function(slice) {
      return Preference.parse(slice, PreferredSymmetricAlgorithms);
    };

    return PreferredSymmetricAlgorithms;

  })(Preference);

  RevocationKey = (function(_super) {
    __extends(RevocationKey, _super);

    function RevocationKey(key_class, alg, fingerprint) {
      this.key_class = key_class;
      this.alg = alg;
      this.fingerprint = fingerprint;
      RevocationKey.__super__.constructor.call(this, S.revocation_key);
    }

    RevocationKey.parse = function(slice) {
      var fp, ka, kc;
      kc = slice.read_uint8();
      ka = slice.read_uint8();
      fp = slice.read_buffer(SHA1.output_size);
      return new RevocationKey(kc, ka, fp);
    };

    RevocationKey.prototype._v_to_buffer = function() {
      return Buffer.concat([uint_to_buffer(8, this.key_class), uint_to_buffer(8, this.alg), new Buffer(this.fingerprint)]);
    };

    return RevocationKey;

  })(SubPacket);

  Issuer = (function(_super) {
    __extends(Issuer, _super);

    function Issuer(id) {
      this.id = id;
      Issuer.__super__.constructor.call(this, S.issuer);
    }

    Issuer.parse = function(slice) {
      return new Issuer(slice.read_buffer(8));
    };

    Issuer.prototype._v_to_buffer = function() {
      return new Buffer(this.id);
    };

    return Issuer;

  })(SubPacket);

  NotationData = (function(_super) {
    __extends(NotationData, _super);

    function NotationData(flags, name, value) {
      this.flags = flags;
      this.name = name;
      this.value = value;
      NotationData.__super__.constructor.call(this, S.notation_data);
    }

    NotationData.parse = function(slice) {
      var flags, name, nl, value, vl;
      flags = slice.read_uint32();
      nl = slice.read_uint16();
      vl = slice.read_uint16();
      name = slice.read_buffer(nl);
      value = slice.read_buffer(vl);
      return new NotationData(flags, name, value);
    };

    NotationData.prototype._v_to_buffer = function() {
      return Buffer.concat([uint_to_buffer(32, this.flags), uint_to_buffer(16, this.name.length), uint_to_buffer(16, this.value.length), new Buffer(this.name), new Buffer(this.valeue)]);
    };

    return NotationData;

  })(SubPacket);

  PreferredHashAlgorithms = (function(_super) {
    __extends(PreferredHashAlgorithms, _super);

    function PreferredHashAlgorithms(v) {
      PreferredHashAlgorithms.__super__.constructor.call(this, S.preferred_hash_algorithms, v);
    }

    PreferredHashAlgorithms.parse = function(slice) {
      return Preference.parse(slice, PreferredHashAlgorithms);
    };

    return PreferredHashAlgorithms;

  })(Preference);

  PreferredCompressionAlgorithms = (function(_super) {
    __extends(PreferredCompressionAlgorithms, _super);

    function PreferredCompressionAlgorithms(v) {
      PreferredCompressionAlgorithms.__super__.constructor.call(this, S.preferred_compression_algorithms, v);
    }

    PreferredCompressionAlgorithms.parse = function(slice) {
      return Preference.parse(slice, PreferredCompressionAlgorithms);
    };

    return PreferredCompressionAlgorithms;

  })(Preference);

  KeyServerPreferences = (function(_super) {
    __extends(KeyServerPreferences, _super);

    function KeyServerPreferences(v) {
      KeyServerPreferences.__super__.constructor.call(this, S.key_server_preferences, v);
    }

    KeyServerPreferences.parse = function(slice) {
      return Preference.parse(slice, PreferredKeyServer);
    };

    return KeyServerPreferences;

  })(Preference);

  Features = (function(_super) {
    __extends(Features, _super);

    function Features(v) {
      Features.__super__.constructor.call(this, S.features, v);
    }

    Features.parse = function(slice) {
      return Preference.parse(slice, Features);
    };

    return Features;

  })(Preference);

  PreferredKeyServer = (function(_super) {
    __extends(PreferredKeyServer, _super);

    function PreferredKeyServer(server) {
      this.server = server;
      PreferredKeyServer.__super__.constructor.call(this, S.preferred_key_server);
    }

    PreferredKeyServer.parse = function(slice) {
      return new PreferredKeyServer(slice.consume_rest_to_buffer());
    };

    PreferredKeyServer.prototype._v_to_buffer = function() {
      return this.server;
    };

    return PreferredKeyServer;

  })(SubPacket);

  PrimaryUserId = (function(_super) {
    __extends(PrimaryUserId, _super);

    function PrimaryUserId(flag) {
      this.flag = flag;
      PrimaryUserId.__super__.constructor.call(this, S.primary_user_id);
    }

    PrimaryUserId.parse = function(slice) {
      return new PrimaryUserId(slice.read_uint8() === 1);
    };

    PrimaryUserId.prototype._v_to_buffer = function() {
      return uint_to_buffer(8, this.flag);
    };

    return PrimaryUserId;

  })(SubPacket);

  PolicyURI = (function(_super) {
    __extends(PolicyURI, _super);

    function PolicyURI(flag) {
      this.flag = flag;
      PolicyURI.__super__.constructor.call(this, S.policy_uri);
    }

    PolicyURI.parse = function(slice) {
      return new PolicyURI(slice.consume_rest_to_buffer());
    };

    PolicyURI.prototype._v_to_buffer = function() {
      return this.flag;
    };

    return PolicyURI;

  })(SubPacket);

  KeyFlags = (function(_super) {
    __extends(KeyFlags, _super);

    function KeyFlags(v) {
      KeyFlags.__super__.constructor.call(this, S.key_flags, v);
    }

    KeyFlags.parse = function(slice) {
      return Preference.parse(slice, KeyFlags);
    };

    return KeyFlags;

  })(Preference);

  SignersUserID = (function(_super) {
    __extends(SignersUserID, _super);

    function SignersUserID(uid) {
      this.uid = uid;
      SignersUserID.__super__.constructor.call(this, S.signers_user_id);
    }

    SignersUserID.parse = function(slice) {
      return new SignersUserID(slice.consume_rest_to_buffer());
    };

    SignersUserID.prototype._v_to_buffer = function() {
      return this.uid;
    };

    return SignersUserID;

  })(SubPacket);

  ReasonForRevocation = (function(_super) {
    __extends(ReasonForRevocation, _super);

    function ReasonForRevocation(flag, reason) {
      this.flag = flag;
      this.reason = reason;
      ReasonForRevocation.__super__.constructor.call(this, S.reason_for_revocation);
    }

    ReasonForRevocation.parse = function(slice) {
      var flag, reason;
      flag = slice.read_uint8();
      reason = slice.consume_rest_to_buffer();
      return new ReasonForRevocation(flag, reason);
    };

    ReasonForRevocation.prototype._v_to_buffer = function() {
      return Buffet.concat([uint_to_buffer(8, this.flag), this.reason]);
    };

    return ReasonForRevocation;

  })(SubPacket);

  SignatureTarget = (function(_super) {
    __extends(SignatureTarget, _super);

    function SignatureTarget(pub_key_alg, hasher, hval) {
      this.pub_key_alg = pub_key_alg;
      this.hasher = hasher;
      this.hval = hval;
      SignatureTarget.__super__.constructor.call(this, S.signature_target);
    }

    SignatureTarget.parse = function(slice) {
      var hasher, hval, pka;
      pka = slice.read_uint8();
      hasher = alloc_or_throw(slice.read_uint8());
      hval = slice.read_buffer(hasher.output_length);
      return new SignatureTarget(pka, hasher, hval);
    };

    SignatureTarget.prototype._v_to_buffer = function() {
      return Buffer.concat([uint_to_buffer(8, this.pub_key_alg), uint_to_buffer(8, this.hasher.type), this.hval]);
    };

    return SignatureTarget;

  })(SubPacket);

  EmbeddedSignature = (function(_super) {
    __extends(EmbeddedSignature, _super);

    function EmbeddedSignature(sig) {
      this.sig = sig;
      EmbeddedSignature.__super__.constructor.call(this, S.embedded_signature);
    }

    EmbeddedSignature.parse = function(slice) {
      return new EmbeddedSignature(Signature.parse(slice));
    };

    return EmbeddedSignature;

  })(SubPacket);

  exports.Signature = Signature;

  Parser = (function() {
    function Parser(slice) {
      this.slice = slice;
    }

    Parser.prototype.parse_v3 = function() {
      var o;
      if (this.slice.read_uint8() !== 5) {
        throw new error("Bad one-octet length");
      }
      o = {};
      o.type = this.slice.read_uint8();
      o.time = new Date(this.slice.read_uint32() * 1000);
      o.sig_data = this.slice.peek_rest_to_buffer();
      o.key_id = this.slice.read_buffer(8);
      o.public_key_class = asymmetric.get_class(this.slice.read_uint8());
      o.hash = alloc_or_throw(this.slice.read_uint8());
      o.signed_hash_value_hash = this.slice.read_uint16();
      o.sig = this.public_key_class.parse_sig(this.slice);
      return new Signature(o);
    };

    Parser.prototype.parse_v4 = function() {
      var end, hashed_subpacket_count, o;
      o = {};
      o.type = this.slice.read_uint8();
      o.public_key_class = asymmetric.get_class(this.slice.read_uint8());
      o.hash = alloc_or_throw(this.slice.read_uint8());
      hashed_subpacket_count = this.slice.read_uint16();
      end = this.slice.i + hashed_subpacket_count;
      o.sig_data = this.slice.peek_to_buffer(end);
      o.subpackets = ((function() {
        var _results;
        _results = [];
        while (this.slice.i < end) {
          _results.push(this.parse_subpacket());
        }
        return _results;
      }).call(this));
      o.signed_hash_value_hash = this.slice.read_uint16();
      o.sig = o.public_key_class.parse_sig(this.slice);
      return new Signature(o);
    };

    Parser.prototype.parse_subpacket = function() {
      var end, klass, len, ret, type;
      len = this.slice.read_v4_length();
      type = this.slice.read_uint8() & 0x7f;
      end = this.slice.clamp(len - 1);
      klass = (function() {
        switch (type) {
          case S.creation_time:
            return CreationTime;
          case S.expiration_time:
            return SigExpirationTime;
          case S.exportable_certificate:
            return Exportable;
          case S.trust_signature:
            return Trust;
          case S.regular_expression:
            return RegularExpression;
          case S.revocable:
            return Revocable;
          case S.key_expiration_time:
            return KeyExpirationTime;
          case S.preferred_symmetric_algorithms:
            return PreferredSymmetricAlgorithms;
          case S.revocation_key:
            return RevocationKey;
          case S.issuer:
            return Issuer;
          case S.notation_data:
            return NotationData;
          case S.preferred_hash_algorithms:
            return PreferredHashAlgorithms;
          case S.preferred_compression_algorithms:
            return PreferredCompressionAlgorithms;
          case S.key_server_preferences:
            return KeyServerPreferences;
          case S.preferred_key_server:
            return PreferredKeyServer;
          case S.primary_user_id:
            return PrimaryUserId;
          case S.policy_uri:
            return PolicyURI;
          case S.key_flags:
            return KeyFlags;
          case S.signers_user_id:
            return SignersUserID;
          case S.reason_for_revocation:
            return ReasonForRevocation;
          case S.features:
            return Features;
          case S.signature_target:
            return SignatureTarget;
          case S.embedded_signature:
            return EmbeddedSignature;
          default:
            throw new Error("Unknown signature subpacket: " + type);
        }
      })();
      ret = klass.parse(this.slice);
      this.slice.unclamp(end);
      console.log("subpacket type -> " + type + " " + len);
      return ret;
    };

    Parser.prototype.parse = function() {
      var version;
      version = this.slice.read_uint8();
      switch (version) {
        case C.versions.signature.V3:
          return this.parse_v3();
        case C.versions.signature.V4:
          return this.parse_v4();
        default:
          throw new Error("Unknown signature version: " + version);
      }
    };

    return Parser;

  })();

  exports.CreationTime = CreationTime;

  exports.Issuer = Issuer;

}).call(this);