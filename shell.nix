{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    bun
    nodejs_latest   # Next.js compatible
    typescript
    pkgs.gcc.cc.lib   # Next.js native binaries (libstdc++.so.6)
  ];

  LD_LIBRARY_PATH = "${pkgs.gcc.cc.lib}/lib";

  shellHook = ''
    export PATH="$HOME/.volta/bin:$PATH"
  '';
}
