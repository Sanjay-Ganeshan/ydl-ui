import { Component } from "react";
import { CloseButton } from "react-bootstrap";
import {
    CameraReelsFill,
    CcSquareFill,
    MusicNoteBeamed,
} from "react-bootstrap-icons";
import "./queue_item.css";

type QueueItemInfo = {
    url: string;
    thumbnail?: string | undefined;
    title: string;
    artist: string;
    audio: boolean;
    video: boolean;
    subtitles: boolean;
    embed_subs: boolean;
};

type QueueItemProps = {
  index: number;
  item: QueueItemInfo;
  onDelete?: (ix: number)=>void | undefined
  onEdit?: (ix: number)=>void | undefined
};

type QueueItemState = {};

class QueueItem extends Component<QueueItemProps, QueueItemState> {
    state = {};

    handleDelete(e: any) {
      if (this.props.onDelete !== undefined) {
        this.props.onDelete(this.props.index);
      }
      e.stopPropagation();
    }

    handleEdit() {
      if (this.props.onEdit !== undefined) {
        this.props.onEdit(this.props.index);
      }
    }

    render() {
        let cc_icon = undefined;
        if (this.props.item.subtitles) {
            cc_icon = <CcSquareFill />;
        }

        let video_icon = undefined;
        if (this.props.item.video) {
            video_icon = <CameraReelsFill />;
        }

        let music_icon = undefined;
        if (this.props.item.audio) {
            music_icon = <MusicNoteBeamed />;
        }
        return (
            <tr onClick={this.handleEdit.bind(this)}>
                <td>
                    <CloseButton onClick={this.handleDelete.bind(this)} />
                </td>
                <td>
                  {this.props.item.title}
                </td>
                <td>
                  {this.props.item.artist}
                </td>
                <td>
                  {video_icon} 
                  {music_icon} 
                  {cc_icon}
                </td>
            </tr>
        );
    }
}

export { QueueItem };
export type { QueueItemProps, QueueItemInfo };
