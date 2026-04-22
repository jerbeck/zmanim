import SwiftUI
import CoreLocation

private enum ViewState {
    case locating
    case zipEntry
    case loading
    case loaded([ZmanimEntry])
    case error(String)
}

struct ContentView: View {
    @State private var locationManager = LocationManager()
    @State private var viewState: ViewState = .locating
    @State private var zip = ""
    @State private var timeoutTask: Task<Void, Never>?

    var body: some View {
        content
            .navigationTitle("Zmanim")
            .onAppear { startLocating() }
            .onChange(of: locationManager.location) { _, newLocation in
                guard let newLocation else { return }
                timeoutTask?.cancel()
                Task { await loadFromLocation(newLocation) }
            }
    }

    @ViewBuilder
    private var content: some View {
        if case .locating = viewState {
            VStack(spacing: 8) {
                ProgressView()
                Text("Locating…")
                    .foregroundStyle(.secondary)
                    .font(.footnote)
            }
        } else if case .zipEntry = viewState {
            VStack(spacing: 10) {
                Text("Enter Zip Code")
                    .font(.headline)
                TextField("12345", text: $zip)
                Button("Search") {
                    Task { await loadFromZip() }
                }
                .disabled(zip.count != 5)
            }
            .padding()
        } else if case .loading = viewState {
            ProgressView("Loading…")
        } else if case .loaded(let zmanim) = viewState {
            List(zmanim) { entry in
                ZmanimRow(entry: entry)
            }
            .listStyle(.plain)
        } else if case .error(let msg) = viewState {
            VStack(spacing: 8) {
                Image(systemName: "exclamationmark.triangle")
                    .font(.title2)
                Text(msg)
                    .font(.footnote)
                    .multilineTextAlignment(.center)
                Button("Try Zip Code") {
                    viewState = .zipEntry
                }
            }
            .padding()
        }
    }

    private func startLocating() {
        viewState = .locating
        locationManager.requestLocation()
        timeoutTask = Task {
            try? await Task.sleep(for: .seconds(10))
            guard !Task.isCancelled else { return }
            if case .locating = viewState {
                viewState = .zipEntry
            }
        }
    }

    private func loadFromLocation(_ loc: CLLocation) async {
        viewState = .loading
        do {
            let zmanim = try await ZmanimService.fetch(
                latitude: loc.coordinate.latitude,
                longitude: loc.coordinate.longitude
            )
            viewState = .loaded(zmanim)
        } catch {
            viewState = .error("Could not load zmanim.\nCheck your connection.")
        }
    }

    private func loadFromZip() async {
        viewState = .loading
        do {
            let zmanim = try await ZmanimService.fetch(zip: zip)
            viewState = .loaded(zmanim)
        } catch {
            viewState = .error("Invalid zip code or\nno connection.")
        }
    }
}
