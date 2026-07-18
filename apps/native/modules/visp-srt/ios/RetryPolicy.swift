struct RetryPolicy {
  private static let delays: [UInt64] = [1, 2, 4]

  private(set) var isCancelled = false
  private var index = 0

  mutating func next() -> (attempt: Int, nanoseconds: UInt64)? {
    guard !isCancelled, index < Self.delays.count else {
      return nil
    }
    defer { index += 1 }
    return (index + 1, Self.delays[index] * 1_000_000_000)
  }

  mutating func cancel() {
    isCancelled = true
  }

  mutating func reset() {
    index = 0
    isCancelled = false
  }
}
