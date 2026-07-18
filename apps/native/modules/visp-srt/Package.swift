// swift-tools-version: 6.0

import PackageDescription

let package = Package(
  name: "VispSrtPolicy",
  platforms: [.macOS(.v13)],
  targets: [
    .target(
      name: "VispSrtPolicy",
      path: "ios",
      exclude: ["VispSrtModule.swift", "VispSrtView.swift"],
      sources: ["RetryPolicy.swift"]
    ),
    .testTarget(
      name: "VispSrtPolicyTests",
      dependencies: ["VispSrtPolicy"],
      path: "Tests"
    ),
  ]
)
