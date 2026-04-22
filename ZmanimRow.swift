import SwiftUI

struct ZmanimRow: View {
    let entry: ZmanimEntry

    var body: some View {
        HStack {
            Text(entry.label)
                .font(.footnote)
            Spacer()
            Text(entry.time)
                .font(.footnote.monospacedDigit())
                .foregroundStyle(.secondary)
        }
    }
}
