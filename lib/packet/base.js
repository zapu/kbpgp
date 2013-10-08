// Generated by IcedCoffeeScript 1.6.3-g
(function() {
  var C, Packet, util;



  util = require('../util');

  C = require('../const').openpgp;

  Packet = (function() {
    function Packet() {}

    Packet.prototype.frame_packet = function(tag, body) {
      var bufs;
      bufs = [new Buffer([0xc0 | tag]), util.encode_length(body.length), body];
      return Buffer.concat(bufs);
    };

    Packet.prototype.set_lengths = function(real_packet_len, header_len) {
      this.real_packet_len = real_packet_len;
      return this.header_len = header_len;
    };

    Packet.prototype.set_tag = function(t) {
      return this.tag = t;
    };

    return Packet;

  })();

  exports.Packet = Packet;

}).call(this);