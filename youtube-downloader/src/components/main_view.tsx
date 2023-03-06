import { Component } from 'react'
import { DownloadOptions } from './download_options'
import { DownloadQueue } from './download_queue'
import { TopNav } from './nav'
import { QueueItemInfo } from './queue_item'

type MainViewProps = {}

type MainViewState = {
    which_view: string
    queue_items: Array<QueueItemInfo>
    editing_item?: QueueItemInfo | undefined
}

class MainView extends Component<MainViewProps, MainViewState> {
  state = {
    which_view: window.location.hash,
    queue_items: [],
    editing_item: undefined
  }

  onEnqueue(item: QueueItemInfo) {
    this.setState((prevState) => ({ queue_items: [...prevState.queue_items, item], editing_item: undefined }));
  }

  onDelete(ix: number) {
    this.setState((prevState) => ({ queue_items: [...prevState.queue_items.slice(undefined, ix), ...prevState.queue_items.slice(ix+1, undefined)]}));
  }

  onEdit(ix: number) {
    const item = this.state.queue_items[ix];
    this.setState(
        (prevState) => (
        {
            queue_items: [...prevState.queue_items.slice(undefined, ix), ...prevState.queue_items.slice(ix+1, undefined)],
            editing_item: item
        }
    )
    );
  }

  render() {
    let middle = (<></>);
    if (window.location.hash === "" || window.location.hash === "#download") {
        middle = (
            <>
            <h1>Download New Video</h1>
            <DownloadOptions onEnqueue={this.onEnqueue.bind(this)} item={this.state.editing_item}/>
            <h1>Queue</h1>
            <DownloadQueue items={this.state.queue_items} onDelete={this.onDelete.bind(this)} onEdit={this.onEdit.bind(this)} />
            </>
        )
    }
    return (
        <>
            <TopNav />
            {middle}
        </>
    )
  }
}

export {MainView}; export type {MainViewProps};